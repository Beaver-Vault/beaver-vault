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
      const { otp } = TOTP.generate("SKLWAHAMEVSYNGGZV6YX4YNMBGJIQMCI");
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
          padding: "2rem",
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
              value="test@gmail.com"
              label="Username"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText("test@gmail.com");
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value="test"
              label="Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText("test");
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
