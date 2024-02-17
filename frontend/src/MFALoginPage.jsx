import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function MFALoginPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = async () => {
    const result = await axios.post("http://127.0.0.1:8000/mfa", {
      mfaCode,
      email: user.email,
    });
    const isvalid = result.data;
    if (isvalid) {
      navigate("/");
    } else {
      alert("Invalid MFA Code");
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
        }}
      >
        <Typography variant="h4">Multi-factor Authentication</Typography>
        <Typography variant="body1">
          Enter your 6 digit code from your Authenticator App
        </Typography>
        <TextField
          type="number"
          onChange={(e) => {
            setMfaCode(e.target.value);
          }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );
}
