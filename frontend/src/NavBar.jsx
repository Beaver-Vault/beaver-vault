import React from 'react';
import { Box, Typography, ButtonBase, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";
import { clearInfo } from "./slices/userInfoSlice";
import BeaverLogo from "./imgs/beaver_logo.png";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.auth.user);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(clearInfo());
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
        {loggedInUser ? (
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