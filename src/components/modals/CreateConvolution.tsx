import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ModelParams, ModelType, Quantity } from "../../types/types";

export const CreateConvolutionModal = ({
  operators,
  quantities,
  handleCreateConvolution,
  handleCloseCreateConvolutionModal,
  openCreateConvolutionModal,
}: {
  operators: string[];
  quantities: Quantity[];
  handleCreateConvolution: (
    quantity1_name: string,
    quantity2_name: string,
    operator1_name: string,
    operator2_name: string,
    operation: string,
    convolution_name: string
  ) => void;
  handleCloseCreateConvolutionModal: () => void;
  openCreateConvolutionModal: boolean;
}) => {
  const [convolutionName, setConvolutionName] = useState("");
  const [operator1Name, setOperator1Name] = useState("");
  const [operator2Name, setOperator2Name] = useState("");
  const [quantity1Name, setQuantity1Name] = useState("");
  const [quantity2Name, setQuantity2Name] = useState("");
  const [operation, setOperation] = useState("");

  // Handler to handle input change
  const handleConvolutionNameChange = (event: any) => {
    setConvolutionName(event.target.value);
  };

  return (
    <Dialog
      open={openCreateConvolutionModal}
      onClose={handleCloseCreateConvolutionModal}
    >
      <DialogTitle>Create Convolution</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Convolution Name"
          type="text"
          fullWidth
          value={convolutionName}
          onChange={(value) => setConvolutionName(value.target.value)}
        />
        <Select
          id="op1"
          value={operator1Name}
          label="Operator 1"
          onChange={(value) => {
            setOperator1Name(value.target.value);
          }}
        >
          {operators.map((operator: string) => {
            return (
              <MenuItem key={operator} value={operator}>
                {operator}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          id="op2"
          value={operator2Name}
          label="Operator 2"
          onChange={(value) => {
            setOperator2Name(value.target.value);
          }}
        >
          {operators.map((operator: string) => {
            return (
              <MenuItem key={`${operator}2`} value={operator}>
                {operator}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          id="q1"
          value={quantity1Name}
          label="Quantity 1"
          onChange={(value) => {
            setQuantity1Name(value.target.value);
          }}
        >
          {quantities.map((q: Quantity) => {
            if (q.operator != operator1Name && q.operator != "global") {
              return;
            }
            return (
              <MenuItem value={q.name}>
                {q.operator} {q.name}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          id="q2"
          value={quantity2Name}
          label="Quantity 2"
          onChange={(value) => {
            setQuantity2Name(value.target.value);
          }}
        >
          {quantities.map((q: Quantity) => {
            if (q.operator != operator2Name && q.operator != "global") {
              return;
            }
            return (
              <MenuItem value={q.name}>
                {q.operator} {q.name}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          id="ope"
          value={operation}
          label="Operation"
          onChange={(value) => {
            setOperation(value.target.value);
          }}
        >
          {["*", "+", "-", "/"].map((op: string) => {
            return <MenuItem value={op}>{op}</MenuItem>;
          })}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCreateConvolutionModal}>Cancel</Button>
        <Button
          onClick={() => {
            handleCreateConvolution(
              quantity1Name,
              quantity2Name,
              operator1Name,
              operator2Name,
              operation,
              convolutionName
            );
            handleCloseCreateConvolutionModal();
          }}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
