import { Box, Typography, TextField, Button, LinearProgress, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import { pdfk } from "./encryption";
import MFASignup from "./MFASignupPage";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignupPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [userCreated, setUserCreated] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthColor, setStrengthColor] = useState('grey');
  const [strengthLabel, setStrengthLabel] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordCriteria = [
    { label: 'Minimum 8 characters', test: (input) => input.length >= 8 },
    { label: 'At least one uppercase letter', test: (input) => /[A-Z]/.test(input) },
    { label: 'At least one lowercase letter', test: (input) => /[a-z]/.test(input) },
    { label: 'At least one number', test: (input) => /[0-9]/.test(input) },
    { label: 'At least one special character', test: (input) => /[^A-Za-z0-9]/.test(input) },
  ];
  const [passwordValidation, setPasswordValidation] = useState(passwordCriteria.map(criteria => ({ ...criteria, isMet: false })));

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const evaluation = zxcvbn(newPassword);

    setPasswordStrength(evaluation.score / 4);
    switch (evaluation.score) {
      case 0:
      case 1:
        setStrengthColor('red');
        setStrengthLabel('Weak');
        break;
      case 2:
        setStrengthColor('yellow');
        setStrengthLabel('Fair');
        break;
      case 3:
        setStrengthColor('orange');
        setStrengthLabel('Good');
        break;
      case 4:
        setStrengthColor('green');
        setStrengthLabel('Strong');
        break;
      default:
        setStrengthColor('grey');
        setStrengthLabel('');
    }

    setPasswordsMatch(newPassword === confirmPassword);

    const validationResults = passwordCriteria.map(criteria => ({
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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const masterKey = pdfk(password, emailAddress);
    const hashedMasterKey = pdfk(masterKey, password);

    const userData = {
      email: emailAddress,
      hashedMasterKey: hashedMasterKey,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/users", userData);

      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        setNewUser(response.data);
        setUserCreated(true);
        alert("User signed up successfully!");
      } else {
        console.error("Error registering user:", response.data);
        alert(`Error: ${response.data.detail}`);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An unexpected error occurred during registration. Please try again.");
    }
  };

  return (
    <>
      {userCreated ? (
        <MFASignup newUser={newUser} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
            margin: "auto",
            width: "40%",
          }}
        >
          <Typography variant="h4">Getting Started</Typography>
          <TextField
            label="Email Address"
            onChange={(e) => setEmailAddress(e.target.value)}
            fullWidth
            variant="filled"
            sx={{
              backgroundColor: "white",
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={handlePasswordChange}
            fullWidth
            variant="filled"
            sx={{
              backgroundColor: "white",
            }}
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
          <LinearProgress variant="determinate" value={passwordStrength * 100} sx={{ width: '100%', marginBottom: '8px', backgroundColor: 'lightgrey', '& .MuiLinearProgress-bar': { backgroundColor: strengthColor } }} />
          <Typography variant="caption" display="block" gutterBottom>
            Password Strength: {strengthLabel}
          </Typography>
          {/* Real-time Password Validation Feedback */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            {passwordValidation.map((criteria, index) => (
              <Typography key={index} variant="caption" sx={{ color: criteria.isMet ? 'green' : 'red' }}>
                {criteria.isMet ? '✓' : '✗'} {criteria.label}
              </Typography>
            ))}
          </Box>
          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords do not match" : ""}
            onChange={handleConfirmPasswordChange}
            fullWidth
            variant="filled"
            sx={{
              backgroundColor: "white",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        </Box>
      )}
    </>
  );
}
