import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { pdfk } from "./encryption";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./slices/authSlice";
import MFALoginPage from "./MFALoginPage";

export default function LoginPage() {
  const dispatch = useDispatch();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);

  const handleLogin = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${emailAddress}`
    );

    const data = response.data;
    if (data === null) {
      alert("Invalid email or password");
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
      alert("Invalid email or password");
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
      )}
    </>
  );
}
