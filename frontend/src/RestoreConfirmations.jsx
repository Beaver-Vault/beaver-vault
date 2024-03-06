import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const RestoreConfirmationDialog = ({ open, handleClose, handleConfirm}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        Are you sure you want to Restore this item?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error">
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestoreConfirmationDialog;