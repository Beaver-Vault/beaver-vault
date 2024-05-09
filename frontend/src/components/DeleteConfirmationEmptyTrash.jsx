import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ConfirmEmptyTrashBinDialog = ({ open, handleClose, handleConfirm }) => {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Empty Trash Bin</DialogTitle>
        <DialogContent>
          Are you sure you want to empty the trash bin? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error">
            Empty Trash Bin
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default ConfirmEmptyTrashBinDialog;
