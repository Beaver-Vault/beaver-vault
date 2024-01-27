import { Box, Typography, ButtonBase, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import BeaverLogo from "./imgs/beaver_logo.png";

export default function NavBar() {
  const { logout, user, isAuthenticated } = useAuth0();
  console.log(user);

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
        {isAuthenticated ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            <Typography variant="h6">{user.name}</Typography>
            <Avatar alt={user.name} src={user.picture} />
            <Button variant="contained" onClick={() => logout()}>
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
