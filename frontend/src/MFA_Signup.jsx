import { Box, Typography, TextField, Button } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import axios from "axios";

export default function MFA_Signup({ newUser }) {
  const [mfaCode, setMfaCode] = useState("");

  const { qr_code_url, user } = newUser;

  const handleSubmit = async () => {
    const result = await axios.post("http://127.0.0.1:8000/mfa", {
      mfaCode,
      email: user.email,
    });
    console.log(result);
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
          Setup MFA with your favorite Authenticator App
        </Typography>
        <QRCodeSVG value={qr_code_url} size={128} />
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
