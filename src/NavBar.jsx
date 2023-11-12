import { Box, Typography, ButtonBase, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BeaverLogo from "./imgs/beaver_logo.png";

export default function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <ButtonBase onClick={() => navigate("/")}>
          <img src={BeaverLogo} alt="Beaver Logo" width={100} />
          <Typography variant="h6">Beaver Vault</Typography>
        </ButtonBase>
        {isLoggedIn ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <Typography variant="h6">Welcome Back Test</Typography>
            <Button variant="contained" onClick={() => setIsLoggedIn(false)}>
              Sign Out
            </Button>
          </Box>
        ) : (
          <> </>
        )}
      </Box>
    </>
  );
}
