import { useState, useRef } from "react";
import { Typography, Button, Menu, MenuItem } from "@mui/material";
import DeleteAccountConfirmationDialog from "./DeleteAccountConfirmation";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { clearInfo } from "../slices/userInfoSlice";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function SettingsMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);

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
    <>
      <Button
        startIcon={<HomeOutlinedIcon />}
        size="large"
        onClick={() => navigate("/")}
      >
        <Typography variant="h5" color="black">
          Home
        </Typography>
      </Button>
      <Button
        startIcon={<SettingsOutlinedIcon />}
        size="large"
        onClick={handleClick}
        ref={buttonRef}
      >
        <Typography variant="h5" color="black">
          Settings
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: 1 }}
      >
        <MenuItem
          onClick={() => {
            navigate("/");
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Change Email
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/");
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Change Master Password
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/passwordgen");
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Generate Password
        </MenuItem>

        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Delete Account
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/dataimport");
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Import Vault
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/dataexport");
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Export Vault
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/trashbin");
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
        >
          Trash Bin
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleSignOut();
            handleClose();
          }}
          sx={{
            minWidth: buttonRef.current ? buttonRef.current.offsetWidth : 0,
          }}
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
    </>
  );
}
