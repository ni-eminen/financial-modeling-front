import React, { useRef, useState } from "react";
import { Grid, Paper, Typography, Button, Stack } from "@mui/material";
import {
  createConvolution,
  createOperator,
  createQuantity,
  getNewSamples,
} from "../services/genericService";
import { CreateOperatorModal } from "./modals/CreateOperator";
import { CreateQuantityModal } from "./modals/CreateQuantity";
import {
  MultinomialModelParams,
  ModelParams,
  ModelType,
  Quantity,
} from "../types/types";
import QuantityComponent from "./Quantity";
import { CreateConvolutionModal } from "./modals/CreateConvolution";

const ProbablyApp = () => {
  // State for managing the modal open/close
  const [operators, setOperators] = useState<string[]>(["global"]);
  const [quantities, setQuantities] = useState<Quantity[]>([]);
  const quantitiesRef = useRef(quantities);
  const [openCreateOperatorModal, setOpenCreateOperatorModal] = useState(false);
  const [openCreateQuantityModal, setOpenCreateQuantityModal] = useState(false);
  const [openCreateConvolutionModal, setOpenCreateConvolutionModal] =
    useState(false);
  const [selectedOperator, setSelectedOperator] = useState<string>("");

  // Handler to close the Create Operator modal
  const handleCloseCreateOperatorModal = () => {
    setOpenCreateOperatorModal(false);
  };

  // Handler to open the Create Operator modal
  const handleOpenCreateOperatorModal = () => {
    setOpenCreateOperatorModal(true);
  };

  // Handler for the "Create" button in the modal
  const handleCreateOperator = async (name: string) => {
    const { operator_name } = await createOperator(name);
    setOperators([...operators, operator_name]);
    setSelectedOperator(operator_name);
    handleCloseCreateOperatorModal(); // Close the modal after creating the operator
  };

  // Handler to close the Create Operator modal
  const handleCloseCreateQuantityModal = () => {
    setOpenCreateQuantityModal(false);
  };

  // Handler to open the Create Quantity modal
  const handleOpenCreateQuantityModal = () => {
    if (selectedOperator == "" || selectedOperator == undefined) {
      setSelectedOperator("global");
    }
    setOpenCreateQuantityModal(true);
  };

  const handleCloseCreateConvolutionModal = () => {
    setOpenCreateConvolutionModal(false);
  };

  // Handler to open the Create Quantity modal
  const handleOpenCreateConvolutionModal = () => {
    setOpenCreateConvolutionModal(true);
  };

  // Handler for the "Create" button in the modal
  const handleCreateQuantity = async (
    q_name: string,
    operator_name: string,
    model: ModelType,
    model_params: ModelParams,
    categories: string[]
  ) => {
    if (model == "multinomial") {
      handleCreateMultinomialQuantity(
        q_name,
        operator_name,
        model,
        model_params as MultinomialModelParams,
        categories
      );
      return;
    }

    // Sanitize params
    for (const key of Object.keys(model_params)) {
      // @ts-ignore TODO: Fix ts error
      const numericVal = parseFloat(model_params[key]); // TODO: multinomial is different. Create a handler for it.
      if (isNaN(numericVal)) {
        return;
      }
      // @ts-ignore TODO: Fix ts error
      model_params[key] = numericVal;
    }

    const quantity = await createQuantity(
      q_name,
      operator_name,
      model,
      model_params,
      categories
    );

    const newQuantities = [quantity, ...quantities];
    setQuantities(newQuantities);
    quantitiesRef.current = newQuantities;
    handleCloseCreateQuantityModal(); // Close the modal after creating the operator
  };

  const updateConvolutions = async () => {
    // Use map with async inside Promise.all to resolve all updates before setting state
    const updatedQuantities = await Promise.all(
      quantities.map(async (q) => {
        if (q.type === "convolution") {
          const samples = await getNewSamples(q.operator, q.name);
          return { ...q, samples };
        }

        return q;
      })
    );

    quantitiesRef.current = updatedQuantities;
    setQuantities(updatedQuantities);
  };

  const updateQuantity = (updatedQuantity: Quantity) => {
    const i = quantities.findIndex((qs) => updatedQuantity.name == qs.name);
    const newQuantities = [...quantities];
    newQuantities[i] = updatedQuantity;
    quantitiesRef.current = newQuantities;
    setQuantities(newQuantities);
  };

  // Handler for the "Create" button in the modal for multinomial quantities
  const handleCreateMultinomialQuantity = async (
    q_name: string,
    operator_name: string,
    model: ModelType,
    model_params: MultinomialModelParams,
    categories: string[]
  ) => {
    model_params["p"] = model_params["p"].map((x) => parseFloat(String(x)));
    model_params.values = model_params.values.map((x) => parseFloat(String(x)));

    if (model_params.p.includes(NaN)) {
      console.log("Not a number in probabilities.");
      return;
    }

    const pTotal = model_params.p.reduce(
      (particalSum, next) => particalSum + next,
      0
    );

    // Sanitize inputs
    if (pTotal < 0.9999 && pTotal > 1.0001) {
      console.log("Probabilities must sum up to 1.");
      return;
    }

    const quantity = await createQuantity(
      q_name,
      operator_name,
      model,
      model_params,
      categories
    );

    const newQuantities = [quantity, ...quantities];
    quantitiesRef.current = newQuantities;
    setQuantities(newQuantities);
    handleCloseCreateQuantityModal(); // Close the modal after creating the operator
  };

  // Handler for the "Create" button in the modal
  const handleCreateConvolution = async (
    quantity1_name: string,
    quantity2_name: string,
    operator1_name: string,
    operator2_name: string,
    operation: string,
    convolution_name: string
  ) => {
    // console.log("Quantity created:", QuantityName);
    const quantity = await createConvolution(
      quantity1_name,
      quantity2_name,
      operator1_name,
      operator2_name,
      operation,
      convolution_name
    );
    const newQuantities = [quantity, ...quantities];
    quantitiesRef.current = newQuantities;
    setQuantities(newQuantities);
    handleCloseCreateQuantityModal(); // Close the modal after creating the operator
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {/* Column 1: Utilities */}
      <Grid item xs={3}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Utilities
          </Typography>

          {/* Button Stack for Utilities */}
          <Stack spacing={2}>
            <Button variant="contained" onClick={handleOpenCreateOperatorModal}>
              Create Operator
            </Button>
            <Button variant="contained" onClick={handleOpenCreateQuantityModal}>
              Create Quantity
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenCreateConvolutionModal}
            >
              Create Convolution
            </Button>
          </Stack>
          <Stack spacing={2} marginTop={2}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Operators
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  fontSize={15}
                  gutterBottom
                  sx={{
                    backgroundColor: "#1E3A8A",
                    color: "#FFFFFF",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {selectedOperator == ""
                    ? `No operator selected`
                    : `Selected: ${selectedOperator}`}
                </Typography>
              </Grid>
            </Grid>
            {operators.map((o: string) => {
              return (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (o === selectedOperator) {
                      setSelectedOperator("");
                    } else {
                      setSelectedOperator(o);
                    }
                  }}
                  sx={{
                    backgroundColor:
                      o === selectedOperator ? "#0d47a1" : "#1976d2", // Darker blue if selected, default blue otherwise
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor:
                        o === selectedOperator ? "#0a397f" : "#1565c0", // Even darker on hover if selected
                    },
                  }}
                >
                  {o}
                </Button>
              );
            })}
          </Stack>
        </Paper>
      </Grid>

      {/* Column 2: Quantities */}
      <Grid item xs={9}>
        <Grid container spacing={2} sx={{ paddingTop: 0 }}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quantities
              </Typography>

              {/* Grid to display each QuantityComponent */}
              <Grid container spacing={2}>
                {quantities
                  .filter((q) => q.operator === selectedOperator)
                  .map((q: Quantity) => (
                    <Grid item xs={6} sm={6} md={6} lg={6} key={q.name}>
                      <QuantityComponent
                        quantity={q}
                        setQuantity={updateQuantity}
                        updateConvolutions={updateConvolutions}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <CreateOperatorModal
        handleCreateOperator={handleCreateOperator}
        handleCloseCreateOperatorModal={handleCloseCreateOperatorModal}
        openCreateOperatorModal={openCreateOperatorModal}
      />
      <CreateQuantityModal
        operatorName={selectedOperator}
        handleCreateQuantity={handleCreateQuantity}
        handleCloseCreateQuantityModal={handleCloseCreateQuantityModal}
        openCreateQuantityModal={openCreateQuantityModal}
      />
      <CreateConvolutionModal
        quantities={quantities}
        operators={operators}
        handleCreateConvolution={handleCreateConvolution}
        handleCloseCreateConvolutionModal={handleCloseCreateConvolutionModal}
        openCreateConvolutionModal={openCreateConvolutionModal}
      />
    </Grid>
  );
};

export default ProbablyApp;
