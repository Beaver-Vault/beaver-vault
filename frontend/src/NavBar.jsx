import React from 'react';
import { Box, Typography, ButtonBase, Button, Menu, MenuItem } from "@mui/material";
import DeleteAccountConfirmationDialog from './DeleteAccountConfirmation';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";
import { clearInfo } from "./slices/userInfoSlice";
import BeaverLogo from "./imgs/beaver_logo.png";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const buttonRef = React.useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(clearInfo());
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem",
        position: 'relative',
      }}
    >
      <ButtonBase onClick={() => navigate("/")}>
        <img src={BeaverLogo} alt="Beaver Logo" width={100} />
        <Typography variant="h5" sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>Beaver Vault</Typography>     
      </ButtonBase>
      {accessToken && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '1.0rem',
          }}
        >
          <Typography variant="h6" sx={{ padding: '0.5rem' }}>{loggedInUser["email"]}</Typography>
          <Button variant="contained" onClick={handleClick} ref={buttonRef}>
            Settings
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
          >
            <MenuItem 
              onClick={() => { 
                navigate('/');
                handleClose();
              }}
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Homepage
            </MenuItem>

            <MenuItem 
              onClick={() => { 
                navigate('/');
                handleClose();
              }} 
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Change Email
            </MenuItem>

            <MenuItem 
              onClick={() => { 
                navigate('/');
                handleClose();
              }} 
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Change Master Password
            </MenuItem>

            <MenuItem 
              onClick={() => {
                navigate('/passwordgen');
                handleClose();
              }} 
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Generate Password
            </MenuItem>

            <MenuItem 
              onClick={() => { 
                setDeleteDialogOpen(true);
                handleClose();
              }} 
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Delete Account
            </MenuItem>

            <MenuItem 
              onClick={() => { 
                navigate('/dataimport');
                handleClose();
              }}
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Import Vault
            </MenuItem>

            <MenuItem 
              onClick={() => { 
                navigate('/dataexport');
                handleClose();
              }}
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Export Vault
            </MenuItem>

            <MenuItem 
              onClick={() => { 
                navigate('/trashbin');
                handleClose();
              }}
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Trash Bin
            </MenuItem>
                        
            <MenuItem 
              onClick={() => { 
                handleSignOut();
                handleClose();
              }} 
              sx={{ minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0 }}
            >
              Sign Out
            </MenuItem>
          </Menu>
          <DeleteAccountConfirmationDialog
            open={deleteDialogOpen}
            handleClose={() => setDeleteDialogOpen(false)}
            email={loggedInUser["email"]}
            userID={loggedInUser["userID"]}
            accessToken={accessToken}
          />
        </Box>
      )}
    </Box>
  );
}