import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState, useEffect } from "react";

export default function CreditCardEntryDetails({ currentEntry, isEditing }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "80%",
          marginTop: "1rem",
        }}
      >
        <TextField
          label="Card Name"
          value={currentEntry ? currentEntry.cardName : ""}
          fullWidth
          type="text"
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Card Holder Name"
          value={currentEntry ? currentEntry.cardholderName : ""}
          fullWidth
          type="text"
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Card Number"
          value={currentEntry ? currentEntry.number : ""}
          fullWidth
          type="text"
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Expiration Date"
          value={currentEntry ? currentEntry.expiration : ""}
          fullWidth
          type="text"
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="CSV"
          value={currentEntry ? currentEntry.csv : ""}
          fullWidth
          type="text"
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
}
