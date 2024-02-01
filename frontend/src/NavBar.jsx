import { Box, Typography, ButtonBase, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BeaverLogo from "./imgs/beaver_logo.png";

export default function NavBar({ isLoggedIn, setIsLoggedIn, loggedInUser }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

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
            <Typography variant="h6">{loggedInUser["email"]}</Typography>
            <Button variant="contained" onClick={handleSignOut}>
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
