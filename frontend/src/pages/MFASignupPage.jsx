import { Box, Typography, TextField, Button } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { setAccessToken, setRefreshToken } from "../slices/authSlice";
import axios from "axios";

export default function MFASignup({ newUser }) {
  const dispatch = useDispatch();
  const [mfaCode, setMfaCode] = useState("");

  const { qr_code_url, user } = newUser;

  const handleSubmit = async () => {
    const result = await axios.post(
      `${process.env.REACT_APP_API_URL}/mfa/signup`,
      {
        mfaCode,
        email: user.email,
      }
    );
    if (result.data === null) {
      dispatch(setSnackbar({ message: "Invalid MFA Code", severity: "error" }));
      setMfaCode("");
      return;
    }
    const { access_token: accessToken, refresh_token: refreshToken } =
      result.data;
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
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
