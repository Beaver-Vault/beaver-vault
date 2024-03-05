import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";
import { encryptText } from "./encryption";
import { useNavigate } from "react-router-dom";
import { useAddPasswordMutation } from "./slices/apiSlice";
import axios from "axios";
import PasswordGenerator from "./PasswordGenPage";
import zxcvbn from "zxcvbn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);

  const [addPasswordPost, passwordResult] = useAddPasswordMutation();

  const [currentFolder, setCurrentFolder] = useState(
    userFolders.length > 0 ? userFolders[0].folderID : ""
  );
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthColor, setStrengthColor] = useState("grey");
  const [strengthLabel, setStrengthLabel] = useState("");
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(false);

  const passwordCriteria = [
    { label: "Minimum 8 characters", test: (input) => input.length >= 8 },
    {
      label: "At least one uppercase letter",
      test: (input) => /[A-Z]/.test(input),
    },
    {
      label: "At least one lowercase letter",
      test: (input) => /[a-z]/.test(input),
    },
    { label: "At least one number", test: (input) => /[0-9]/.test(input) },
    {
      label: "At least one special character",
      test: (input) => /[^A-Za-z0-9]/.test(input),
    },
  ];
  const [passwordValidation, setPasswordValidation] = useState(
    passwordCriteria.map((criteria) => ({ ...criteria, isMet: false }))
  );

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

    setPasswordsMatch(newPassword === confirmPassword);

    const validationResults = passwordCriteria.map((criteria) => ({
      ...criteria,
      isMet: criteria.test(newPassword),
    }));
    setPasswordValidation(validationResults);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const passwordData = {
      folderID: currentFolder,
      websiteName: encryptText(website, loggedInUser.masterKey),
      username: encryptText(username, loggedInUser.masterKey),
      encryptedPassword: encryptText(password, loggedInUser.masterKey),
    };

    try {
      await addPasswordPost(passwordData).unwrap();
      alert("Password added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error adding password:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "30%",
        height: "75vh",
        margin: "auto",
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
      {passwordValidation.map((criteria, index) => (
        <Typography
          key={index}
          variant="caption"
          sx={{ color: criteria.isMet ? "green" : "red" }}
        >
          {criteria.isMet ? "✓" : "✗"} {criteria.label}
        </Typography>
      ))}
      <TextField
        fullWidth
        variant="outlined"
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={!passwordsMatch}
        helperText={!passwordsMatch ? "Passwords do not match" : ""}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={useGeneratedPassword}
            onChange={(e) => setUseGeneratedPassword(e.target.checked)}
          />
        }
        label="Use Generated Password"
      />
      {useGeneratedPassword && <PasswordGenerator />}
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
