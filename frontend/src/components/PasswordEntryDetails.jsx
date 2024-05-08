import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState, useEffect } from "react";

export default function PasswordEntryDetails({ currentEntry, isEditing }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setPasswordVisible(false);
  }, [currentEntry]);
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
          label="Website"
          value={currentEntry ? currentEntry.websiteName : ""}
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
          label="Username"
          value={currentEntry ? currentEntry.username : ""}
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
          label="Password"
          value={currentEntry ? currentEntry.encryptedPassword : ""}
          fullWidth
          type={passwordVisible ? "text" : "password"}
          disabled={!isEditing}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <RemoveRedEyeIcon />
                </IconButton>
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
