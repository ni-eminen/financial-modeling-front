import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

export const CreateOperatorModal = ({
  handleCreateOperator,
  handleCloseCreateOperatorModal,
  openCreateOperatorModal,
}: {
  handleCreateOperator: (name: string) => void;
  handleCloseCreateOperatorModal: () => void;
  openCreateOperatorModal: boolean;
}) => {
  const [operatorName, setOperatorName] = useState("");

  // Handler to handle input change
  const handleOperatorNameChange = (event: any) => {
    setOperatorName(event.target.value);
  };

  return (
    <Dialog
      open={openCreateOperatorModal}
      onClose={handleCloseCreateOperatorModal}
    >
      <DialogTitle>Create Operator</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Operator Name"
          type="text"
          fullWidth
          value={operatorName}
          onChange={handleOperatorNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCreateOperatorModal}>Cancel</Button>
        <Button
          onClick={() => handleCreateOperator(operatorName)}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
