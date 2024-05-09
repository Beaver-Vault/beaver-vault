import { Box, Typography, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { setAccessToken, setRefreshToken } from "../slices/authSlice";
import axios from "axios";

export default function MFALoginPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = async (the_code) => {
    const result = await axios.post(
      `${process.env.REACT_APP_API_URL}/mfa/login`,
      {
        mfaCode: the_code,
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

  const onTextChange = (e) => {
    const value = e.target.value;
    if (value.length > 6) {
      return;
    }
    const last_char = value[value.length - 1];
    if (isNaN(last_char) && value !== "") {
      return;
    }
    setMfaCode(value);
    if (value.length === 6) {
      handleSubmit(value);
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
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
          }}
        >
          Multi-factor Authentication
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
          }}
        >
          Enter your 6 digit code from your Authenticator App
        </Typography>
        <TextField
          value={mfaCode}
          autoFocus
          onChange={onTextChange}
          sx={{
            "& .MuiInputBase-input": {
              textAlign: "center",
              fontSize: "3rem",
              padding: "0",
            },
          }}
        />
      </Box>
    </>
  );
}
