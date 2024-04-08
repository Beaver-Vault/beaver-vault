import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ConfirmationDialog = ({ open, handleClose, handleConfirm, handle30DayTrashBin }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this item?
        <br></br>
        Move to Trash Bin to recover it within 30 days.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error">
          Delete
        </Button>
        <Button onClick={handle30DayTrashBin} color="primary">
          Move to Trash Bin
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;