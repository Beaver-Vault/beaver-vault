import { Box, Typography, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function NewPasswordPage() {
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "40%",
        margin: "auto",
      }}
    >
      <Typography variant="h4">New Password</Typography>
      <Select variant="filled" fullWidth onChange={(e) => console.log(e)}>
        {userFolders.map((folder) => (
          <MenuItem key={folder.id} value={folder.id}>
            {folder.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
