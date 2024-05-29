import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { TOTP } from "totp-generator";

export default function TestCreds() {
  const [showTestCreds, setShowTestCreds] = useState(false);
  const [otp, setOtp] = useState("");

  const handleClick = () => {
    setShowTestCreds(!showTestCreds);
  };

  useEffect(() => {
    const generateNewOtp = () => {
      const { otp } = TOTP.generate("TWUS3C3MMVYNOJWVOPURN5YZOWSC5IEF");
      setOtp(otp);
    };
    generateNewOtp();

    const timer = setInterval(() => {
      generateNewOtp();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          height: "250px",
          width: "300px",
        }}
      >
        <Button variant="outlined" onClick={handleClick}>
          {showTestCreds ? "Hide" : "Show"} Test Credentials
        </Button>
        {showTestCreds && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <TextField
              value="testuser@oregonstate.edu"
              label="Username"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "testuser@oregonstate.edu"
                        );
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value="Gob3@vers!"
              label="Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText("Gob3@vers!");
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value={otp}
              label="OTP"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(otp);
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
