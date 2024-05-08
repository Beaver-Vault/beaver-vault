import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SettingsMenu from "./SettingsMenu";
import BeaverLogo from "../imgs/BeaverVaultLogo_New.svg";

export default function NavBar() {
  const loggedInUser = useSelector((state) => state.auth.user);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem 0 2rem",
      }}
    >
      {/* Logo and Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <img src={BeaverLogo} alt="Beaver Logo" width={100} />
        <Typography variant="h3" marginLeft={3}>
          BeaverVault
        </Typography>
      </Box>
      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <SettingsMenu />
        <Typography variant="h5">{loggedInUser["email"]}</Typography>
      </Box>
    </Box>
  );
}
