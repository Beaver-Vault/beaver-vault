import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { pdfk } from "./encryption";
import MFASignup from "./MFASignupPage";

export default function SignupPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const [newUser, setNewUser] = useState({});

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
      const response = await axios.post(
        "http://127.0.0.1:8000/users",
        userData
      );

      if (response.status !== 200) {
        console.error("Error registering user:", response.data);
        alert(`Error: ${response.data.detail}`);
      }

      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        setNewUser(response.data);
        setUserCreated(true);
        alert("User signed up successfully!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert(
        "An unexpected error occurred during registration. Please try again."
      );
    }

    // navigate("/");
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
      )}
    </>
  );
}
