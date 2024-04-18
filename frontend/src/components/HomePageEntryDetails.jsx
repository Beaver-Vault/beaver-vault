import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function HomePageEntryDetails() {
  const currentEntry = useSelector((state) => state.uiStatus.currentEntry);

  const [isEditing, setIsEditing] = useState(false);
  const [usernameVisible, setUsernameVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setIsEditing(false);
    setUsernameVisible(false);
    setPasswordVisible(false);
  }, [currentEntry]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
        }}
      >
        <div></div>
        <Typography variant="h5">Entry Details</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
          }}
        >
          <IconButton onClick={() => setIsEditing(!isEditing)}>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "80%",
        }}
      >
        <TextField
          label="Website"
          value={currentEntry ? currentEntry.websiteName : ""}
          fullWidth
          disabled={!isEditing}
        />
        <TextField
          label="Username"
          value={currentEntry ? currentEntry.username : ""}
          fullWidth
          type={usernameVisible ? "text" : "password"}
          disabled={!isEditing}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={() => setUsernameVisible(!usernameVisible)}
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
        <TextField
          label="Password"
          value={currentEntry ? currentEntry.encryptedPassword : ""}
          fullWidth
          type={passwordVisible ? "text" : "password"}
          disabled={!isEditing}
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
