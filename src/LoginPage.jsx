import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (emailAddress !== "test" || password !== "test") {
      alert("Email address or password is incorrect");
      return;
    }
    setIsLoggedIn(true);
    navigate("/");
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
        <Typography variant="h4">Login</Typography>
        <TextField
          onChange={(e) => setEmailAddress(e.target.value)}
          fullWidth
          variant="filled"
          label="Email"
          sx={{
            backgroundColor: "white",
          }}
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="filled"
          label="Password"
          type="password"
          sx={{
            backgroundColor: "white",
          }}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </>
  );
}
