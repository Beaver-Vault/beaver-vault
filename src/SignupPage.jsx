import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Register User!");
    console.log(name, emailAddress, password, confirmPassword);
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
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="filled"
          label="Name"
          sx={{
            backgroundColor: "white",
          }}
        />
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
