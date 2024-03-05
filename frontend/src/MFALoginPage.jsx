import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "./slices/authSlice";
import axios from "axios";

export default function MFALoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = async () => {
    const result = await axios.post(`${process.env.REACT_APP_API_URL}/mfa/login`, {
      mfaCode,
      email: user.email,
    });
    const accessToken = result.data;
    if (accessToken !== null) {
      dispatch(setAccessToken(accessToken));
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
