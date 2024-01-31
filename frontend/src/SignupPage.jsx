import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function SignupPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      email: emailAddress,
      hashedMasterKey: password,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/users", userData);

      if (response.status !== 200) {
        console.error("Error registering user:", response.data);
        alert(`Error: ${response.data.detail}`);
        return;
      }

      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        alert("User signed up successfully!");
        return;
      }

    } catch (error) {
      console.error("Error registering user:", error);
      alert("An unexpected error occurred during registration. Please try again.");
    }
  };

  return (
    <>
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
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="filled"
          sx={{
            backgroundColor: "white",
          }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          variant="filled"
          sx={{
            backgroundColor: "white",
          }}
        />
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Register
        </Button>
      </Box>
    </>
  );
}
