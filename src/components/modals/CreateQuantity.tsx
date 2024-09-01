import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  CategoricalModelParams,
  ModelParams,
  ModelType,
} from "../../types/types";

export const CreateQuantityModal = ({
  operatorName,
  handleCreateQuantity,
  handleCloseCreateQuantityModal,
  openCreateQuantityModal,
}: {
  operatorName: string;
  handleCreateQuantity: (
    q_name: string,
    operator_name: string,
    model: ModelType,
    model_params: ModelParams,
    categories: string[]
  ) => void;
  handleCloseCreateQuantityModal: () => void;
  openCreateQuantityModal: boolean;
}) => {
  const defaultModelParams = {
    a: 0,
    scale: 0,
  };
  const defaultModel = "gamma";

  const [quantityName, setQuantityName] = useState("");
  const [modelType, setModelType] = useState<ModelType>("gamma");
  const [modelParams, setModelParams] =
    useState<ModelParams>(defaultModelParams);
  const [columns, setColumns] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const models: ModelType[] = ["gamma", "binomial", "categorical"];

  const getModelParams = (model: ModelType): ModelParams => {
    switch (model) {
      case "gamma":
        return { a: 0, scale: 0 };
      case "binomial":
        return { n: 0, p: 0 };
      case "categorical":
        return { p: [], categories: [], values: [] };
    }
  };

  useEffect(() => {
    const params = getModelParams(modelType);
    setModelParams(params as ModelParams);
  }, [modelType]);

  // Handler to handle input change
  const handleQuantityNameChange = (event: any) => {
    setQuantityName(event.target.value);
  };

  return (
    <Dialog
      open={openCreateQuantityModal}
      onClose={handleCloseCreateQuantityModal}
    >
      <DialogTitle>Create Quantity for {operatorName}</DialogTitle>
      <DialogContent>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={modelType}
          label="Model"
          onChange={(value) => {
            setModelType(value.target.value as ModelType);
          }}
        >
          {models.map((model: string) => {
            return <MenuItem value={model}>{model}</MenuItem>;
          })}
        </Select>
        <TextField
          autoFocus
          margin="dense"
          label="Quantity Name"
          type="text"
          fullWidth
          value={quantityName}
          onChange={handleQuantityNameChange}
        />
        {modelType != "categorical" ? (
          Object.keys(modelParams).map((arg: string, i: number) => {
            return (
              <TextField
                autoFocus
                margin="dense"
                label={arg}
                type="text"
                fullWidth
                value={modelParams[arg as keyof ModelParams]}
                onChange={(value) => {
                  setModelParams({ ...modelParams, [arg]: value.target.value });
                }}
              />
            );
          })
        ) : (
          <div>
            {/* Grid container for all columns */}
            <Grid container spacing={2}>
              {/* Loop through each column */}
              {columns.map((col, columnIndex) => (
                <Grid item xs={12} key={columnIndex}>
                  <Grid container spacing={2}>
                    {/* Loop through each input field in a column */}
                    {["categories", "p", "values"].map((arg, i) => (
                      <Grid item xs={4} key={arg}>
                        <TextField
                          autoFocus
                          margin="dense"
                          label={
                            ["category name", "probability", "numerical value"][
                              i
                            ]
                          }
                          type="text"
                          fullWidth
                          value={
                            modelParams[arg as keyof ModelParams][columnIndex]
                          }
                          onChange={(event) => {
                            const newString = event.target.value;

                            let oldArr: string[] =
                              modelParams[arg as keyof typeof modelParams];

                            if (oldArr.length == 0) {
                              oldArr.push(newString);
                            } else {
                              oldArr[columnIndex] = newString;
                            }

                            const newModelParams = {
                              ...modelParams,
                              [arg]: oldArr,
                            };

                            setCategories(
                              (newModelParams as CategoricalModelParams)
                                .categories
                            );

                            setModelParams(newModelParams);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {/* Button to add a new column */}
            <Button
              variant="contained"
              onClick={() => {
                setColumns([...columns, columns.length + 1]);
              }}
              style={{ marginTop: "20px" }}
            >
              Add Column
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCreateQuantityModal}>Cancel</Button>
        <Button
          onClick={() => {
            handleCreateQuantity(
              quantityName,
              operatorName,
              modelType,
              modelParams,
              categories
            );
            setModelParams(defaultModelParams);
            setModelType(defaultModel);
            setCategories([]);
            setColumns([]);
            setQuantityName("");
          }}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
