import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import axios from 'axios';

const DeleteAccountConfirmationDialog = ({ open, handleClose, userID, accessToken }) => {
  const [input, setInput] = useState("");

  const handleDelete = async () => {
    if (input === "BeaverVaultDeleteAccount") {
      try {
        await axios.delete(`http://localhost:8000/users/${userID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        handleClose();
        window.location.href = 'http://localhost:3000';
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      alert("Please type 'BeaverVaultDeleteAccount' to confirm deletion.");
    }
  };

  const handleCancel = () => {
    setInput("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Confirm Account Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete your account? This action cannot be undone. <br /> <br /> Please confirm below by typing "BeaverVaultDeleteAccount" in the box below.
        <TextField
          autoFocus
          margin="normal"
          id="name"
          label="Confirmation"
          type="text"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" disabled={input !== "BeaverVaultDeleteAccount"}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountConfirmationDialog;