import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { pdfk } from "../scripts/encryption";
import { useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { login } from "../slices/authSlice";
import MFALoginPage from "./MFALoginPage";

export default function LoginPage() {
  const dispatch = useDispatch();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${emailAddress}`
    );

    const data = response.data;
    if (data === null) {
      dispatch(
        setSnackbar({ message: "Invalid email or password", severity: "error" })
      );
      return;
    }

    const masterKey = pdfk(password, emailAddress);
    const hashedMasterKey = pdfk(masterKey, password);

    if (hashedMasterKey === response.data.hashedMasterKey) {
      const newUserData = {
        masterKey: masterKey,
        ...response.data,
      };
      dispatch(login(newUserData));
    } else {
      dispatch(
        setSnackbar({ message: "Invalid email or password", severity: "error" })
      );
    }
  };

  return (
    <>
      {user !== null ? (
        <MFALoginPage />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            margin: "auto",
            width: "100%",
          }}
        >
          <TextField
            autoFocus
            onChange={(e) => setEmailAddress(e.target.value)}
            onKeyDown={handleKeyPress}
            fullWidth
            variant="filled"
            label="Email"
            sx={{
              backgroundColor: "white",
            }}
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            fullWidth
            variant="filled"
            label="Password"
            type="password"
            sx={{
              backgroundColor: "white",
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
          >
            <Typography variant="h6">Login</Typography>
          </Button>
        </Box>
      )}
    </>
  );
}
