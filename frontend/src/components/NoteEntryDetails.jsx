import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState, useEffect } from "react";

export default function NoteEntryDetails({ currentEntry, isEditing }) {
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
          label="Note Name"
          value={currentEntry ? currentEntry.noteName : ""}
          fullWidth
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
          label="Content"
          value={currentEntry ? currentEntry.content : ""}
          fullWidth
          multiline
          rows={4}
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
