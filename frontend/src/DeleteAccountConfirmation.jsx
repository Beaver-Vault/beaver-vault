import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import axios from 'axios';

const DeleteAccountConfirmationDialog = ({ open, handleClose, email, userID, accessToken }) => {
  const [input, setInput] = useState("");

  const handleDelete = async () => {
    if (input === `Yes, delete ${email}`) {
      try {
        await axios.delete(`${REACT_APP_API_URL}/users/${userID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        handleClose();
        window.location.href = `${REACT_APP_DELETE_REDIRECT}`;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      alert(`Please type: "Yes, delete ${email}" without the quotes.`);
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
        Are you sure you want to delete your account? This action cannot be undone. <br /> <br /> Confirm by typing: <strong>Yes, delete {email}</strong>
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
        <Button onClick={handleDelete} color="error" disabled={input !== `Yes, delete ${email}`}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountConfirmationDialog;