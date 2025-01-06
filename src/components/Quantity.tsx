// QuantityComponent.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Slider,
  Button,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import TextField from "@mui/material/TextField";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartOptions, // Import LineElement
} from "chart.js";
import {
  Quantity,
  XYSamplesCategorical,
  XYSamplesNumerical,
} from "../types/types";
import { updateQuantityParams } from "../services/genericService";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement, // Register PointElement
  LineElement // Register LineElement
);

function getMax(arr: number[]) {
  let len = arr.length;
  let max = -Infinity;

  while (len--) {
    max = arr[len] > max ? arr[len] : max;
  }
  return max;
}

function getMin(arr: number[]) {
  let len = arr.length;
  let max = -Infinity;

  while (len--) {
    max = arr[len] < max ? arr[len] : max;
  }
  return max;
}

// Function to bin samples data into a specified number of bins (frequency)
const binSamplesData = (samples: number[], numberOfBins: number) => {
  const min = getMin(samples);
  const max = getMax(samples);
  const binWidth = (max - min) / numberOfBins;

  const bins = new Array(numberOfBins).fill(0); // Initialize bins with zeros

  samples.forEach((sample) => {
    const binIndex = Math.min(
      Math.floor((sample - min) / binWidth),
      numberOfBins - 1
    );
    bins[binIndex]++; // Increment count for each sample in its corresponding bin
  });

  return {
    binEdges: Array.from(
      { length: numberOfBins },
      (_, i) => min + i * binWidth
    ),
    bins,
  };
};

const binPdfDataCategorical = (pdfSamples: XYSamplesNumerical) => {
  const nOfBins = pdfSamples.x.length;

  const bins = pdfSamples.y;

  return {
    bins,
  };
};

// Function to bin PDF data into a specified number of bins (density)
const binPdfData = (pdfSamples: XYSamplesNumerical, numberOfBins: number) => {
  const min = Math.min(...pdfSamples.x);
  const max = Math.max(...pdfSamples.x);
  const binWidth = (max - min) / numberOfBins;

  const bins = new Array(numberOfBins).fill(0); // Initialize bins with zeros

  pdfSamples.x.forEach((xValue, index) => {
    const binIndex = Math.min(
      Math.floor((xValue - min) / binWidth),
      numberOfBins - 1
    );
    bins[binIndex] += pdfSamples.y[index]; // Sum the y values (densities) within each bin range
  });

  return {
    binEdges: Array.from(
      { length: numberOfBins },
      (_, i) => min + i * binWidth
    ),
    bins,
  };
};

const QuantityComponent = ({ quantity }: { quantity: Quantity }) => {
  const [quantity_, setQuantity] = useState<Quantity>(quantity);
  const [expanded, setExpanded] = useState(false);
  const [paramsState, setParamsState] = useState<{ [key: string]: string }>(
    quantity_.params
  );
  const [pdfData, setPdfData] = useState<any>();

  // State for the number of bins
  const [numberOfBins, setNumberOfBins] = useState(
    quantity_.domain_type == "discrete"
      ? quantity_.pdf_samples.y.filter((y) => y != 0).length
      : 10
  );

  useEffect(() => {
    const getData = async () => {
      const newParams = Object.fromEntries(
        Object.entries(paramsState).map(([key, value]) => [
          key,
          parseFloat(value),
        ])
      );

      if (
        Object.values(newParams)
          .map((val) => isNaN(val))
          .includes(true)
      ) {
        return;
      }

      const newQuantity = await updateQuantityParams(
        quantity_.name,
        newParams,
        quantity_.operator
      );

      setQuantity(newQuantity);
    };

    paramsState != quantity.params && getData();
  }, [paramsState]);

  // Data for the histogram (bar chart)
  // const samplesData = {
  //   labels: samplesBin.binEdges.map((edge) => edge.toFixed(0)), // Use bin edges as labels
  //   datasets: [
  //     {
  //       label: "Frequency",
  //       data: samplesBin.bins,
  //       backgroundColor: "rgba(75, 192, 192, 0.6)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  useEffect(() => {
    const pdfBin =
      quantity_.categories.length != 0
        ? binPdfDataCategorical(quantity_.pdf_samples)
        : binPdfData(quantity_.pdf_samples, numberOfBins);
    // Data for the PDF bin chart (displaying density per bin)
    const newPdfData = {
      labels:
        quantity_.categories.length != 0
          ? quantity_.categories
          : (pdfBin as any).binEdges.map((edge: any) => edge.toFixed(0)), // Use bin edges as labels
      datasets: [
        {
          label: "PDF Density",
          data: pdfBin.bins, // Use the sum of densities in each bin
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
    setPdfData(newPdfData);
  }, [quantity_, numberOfBins]);

  // Data for the CDF line chart (displaying values directly)
  // Data for the CDF line chart (displaying values directly)
  const cdfData = {
    labels: quantity_.cdf_samples.x.map((n) => {
      if (typeof n == "string") {
        return n;
      }
      return n.toFixed();
    }), // Use sample indices as labels
    datasets: [
      {
        label: "CDF Values",
        data: quantity_.cdf_samples.y, // Directly use the cdf_samples values
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Sample Value Range",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90,
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Sample Index",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "nearest", // Tooltip appears for nearest point
        intersect: false, // Tooltip shows even if the cursor is near a point (not necessarily intersecting)
      },
    },
    hover: {
      mode: "nearest", // Corrected to ensure it's a valid option
      intersect: false, // Shows tooltip when near a point, not just when directly intersecting
      axis: "xy", // Sensitivity on both axes
      //   radius: 10, // Increase hover radius to 10 pixels
    },
  };

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {quantity_.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Operator: {quantity_.operator}
        </Typography>

        {/* Slider to control the number of bins */}
        <Box sx={{ marginTop: 2 }}>
          <Typography gutterBottom>Number of Bins: {numberOfBins}</Typography>
          {true ? (
            <Slider
              value={numberOfBins}
              min={5}
              max={30}
              step={1}
              onChange={(event, newValue) =>
                setNumberOfBins(newValue as number)
              }
              valueLabelDisplay="auto"
            />
          ) : (
            <></>
          )}
        </Box>

        {/* Params */}
        {quantity_.type !== "convolution" ? (
          <Box sx={{ marginTop: 2 }}>
            <Typography gutterBottom>Parameters:</Typography>
            {Object.entries(paramsState).map(([key, value], i) => {
              return (
                <TextField
                  sx={{ paddingTop: "8px", paddingBottom: "8px" }}
                  key={key} // Add key prop for better performance and to avoid console warnings
                  label={key}
                  id={`outlined-number-${i}`} // Ensure unique ID for each TextField
                  type="number"
                  value={value} // Handle undefined value gracefully
                  onChange={(e) => {
                    let value = e.target.value.replace(/,/g, ".");
                    setParamsState({
                      ...paramsState,
                      [key]: value,
                    });
                  }}
                />
              );
            })}
          </Box>
        ) : (
          <></>
        )}

        {/* Histogram (Bar Chart) */}
        {/* PDF Bin Chart */}
        <Box sx={{ marginTop: 2 }}>
          <Typography>Forecast</Typography>
          {pdfData && <Bar data={pdfData} options={barChartOptions} />}
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Shrink" : "Expand"}
          </Button>
        </Box>

        {/* Line Chart for CDF */}
        {expanded ? (
          <Box sx={{ marginTop: 2 }}>
            <Typography>CDF</Typography>
            <Line data={cdfData} options={lineChartOptions} />
          </Box>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantityComponent;
