import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function LandingPage() {
  const { loginWithRedirect, user } = useAuth0();

  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/signup");
  };
  const handleLogin = () => {
    loginWithRedirect();
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
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login / Signup
        </Button>
      </Box>
    </>
  );
}
