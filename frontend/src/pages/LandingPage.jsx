import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import BeaverVaultLogo from "../imgs/BeaverVaultLogo_New.svg";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TestCreds from "../components/TestCreds";

export default function LandingPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const Status = {
    NONE: "none",
    LOGIN: "login",
    SIGNUP: "signup",
    MFA: "mfa",
  };

  const [currentView, setCurrentView] = useState(Status.NONE);

  const handleGetStarted = () => {
    if (currentView === Status.SIGNUP) {
      setCurrentView(Status.NONE);
    } else {
      setCurrentView(Status.SIGNUP);
    }
  };
  const handleLogin = () => {
    if (currentView === Status.LOGIN) {
      setCurrentView(Status.NONE);
    } else {
      setCurrentView(Status.LOGIN);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: isSmallScreen ? "1rem" : "4rem",
          }}
        >
          <img
            src={BeaverVaultLogo}
            alt="BeaverVault Logo"
            width={isSmallScreen ? 100 : 200}
          />
          {/* Titles */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: isSmallScreen ? "0px" : "50px",
            }}
          >
            <Typography variant="h2">BeaverVault</Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontStyle: "italic",
                marginTop: "1rem",
              }}
            >
              Secure Your Dam Passwords!
            </Typography>
          </Box>
          {currentView === Status.LOGIN || currentView === Status.MFA ? (
            <TestCreds />
          ) : null}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
            width: isSmallScreen ? "80%" : "50%",
            maxWidth: "800px",
          }}
        >
          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
              width: "100%",
            }}
          >
            <Button
              variant={currentView === Status.SIGNUP ? "contained" : "outlined"}
              color="primary"
              fullWidth
              onClick={handleGetStarted}
            >
              <Typography variant="h5">Sign up</Typography>
            </Button>
            <Button
              variant={currentView === Status.LOGIN ? "contained" : "outlined"}
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              <Typography variant="h5">Login</Typography>
            </Button>
          </Box>
          {/* Forms */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1rem",
              width: "100%",
              // backgroundColor: "red",
            }}
          >
            {currentView === Status.LOGIN ? (
              <LoginPage />
            ) : currentView === Status.SIGNUP ? (
              <SignupPage />
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}
