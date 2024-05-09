import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  LinearProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { encryptText } from "../scripts/encryption";
import { useAddPasswordMutation } from "../slices/apiSlice";

import zxcvbn from "zxcvbn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function NewPasswordPage({ setModalOpen, refetch }) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);
  const currentUIFolder = useSelector((state) => state.uiStatus.currentFolder);

  const [addPasswordPost, passwordResult] = useAddPasswordMutation();

  const [currentFolder, setCurrentFolder] = useState(
    userFolders.length > 0 ? currentUIFolder.folderID : ""
  );

  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthColor, setStrengthColor] = useState("grey");
  const [strengthLabel, setStrengthLabel] = useState("");

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const evaluation = zxcvbn(newPassword);
    setPasswordStrength(evaluation.score / 4);
    switch (evaluation.score) {
      case 0:
      case 1:
        setStrengthColor("red");
        setStrengthLabel("Weak");
        break;
      case 2:
        setStrengthColor("yellow");
        setStrengthLabel("Fair");
        break;
      case 3:
        setStrengthColor("orange");
        setStrengthLabel("Good");
        break;
      case 4:
        setStrengthColor("green");
        setStrengthLabel("Strong");
        break;
      default:
        setStrengthColor("grey");
        setStrengthLabel("");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    const passwordData = {
      folderID: currentFolder,
      websiteName: encryptText(website, loggedInUser.masterKey),
      username: encryptText(username, loggedInUser.masterKey),
      encryptedPassword: encryptText(password, loggedInUser.masterKey),
    };

    try {
      await addPasswordPost(passwordData).unwrap();
      setModalOpen(false);
      dispatch(
        setSnackbar({
          message: "Password added successfully",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      console.error("Error adding password:", error);
      dispatch(
        setSnackbar({
          message: "An unexpected error occurred. Please try again.",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        margin: "auto",
        gap: "2rem",
      }}
    >
      <Typography variant="h4">Add New Password</Typography>
      <Select
        fullWidth
        value={currentFolder}
        onChange={(e) => setCurrentFolder(e.target.value)}
      >
        {userFolders.map((folder, i) => (
          <MenuItem key={i} value={folder.folderID}>
            {folder.folderName}
          </MenuItem>
        ))}
      </Select>
      <TextField
        fullWidth
        variant="outlined"
        label="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LinearProgress
        variant="determinate"
        value={passwordStrength * 100}
        sx={{
          width: "100%",
          marginTop: "8px",
          marginBottom: "8px",
          backgroundColor: "lightgrey",
          "& .MuiLinearProgress-bar": { backgroundColor: strengthColor },
        }}
      />
      <Typography variant="caption" display="block" gutterBottom>
        Password Strength: {strengthLabel}
      </Typography>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        Save
      </Button>
    </Box>
  );
}
