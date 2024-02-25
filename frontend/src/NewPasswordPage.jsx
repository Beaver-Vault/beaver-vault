import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSelector } from "react-redux";
import { encryptText } from "./encryption";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordGenerator from "./PasswordGenPage";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);

  const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(false); // State to manage whether to use generated password

  const handleSubmit = async () => {
    const passwordData = {
      folderID: currentFolder,
      websiteName: encryptText(website, loggedInUser.masterKey),
      username: encryptText(username, loggedInUser.masterKey),
      encryptedPassword: encryptText(password, loggedInUser.masterKey),
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/passwords",
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      alert("Password added successfully");
      navigate("/");
    } else {
      alert("Failed to add password");
      console.log(response.data);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "30%",
        height: "75vh",
        margin: "auto",
      }}
    >
      <Typography variant="h4">Add New Password</Typography>
      <Select
        fullWidth
        value={currentFolder}
        onChange={(e) => {
          setCurrentFolder(e.target.value);
        }}
      >
        {userFolders.map((folder, i) => {
          return (
            <MenuItem key={i} value={folder.folderID}>
              {folder.folderName}
            </MenuItem>
          );
        })}
      </Select>
      <TextField
        fullWidth
        variant="outlined"
        label="Website"
        value={website}
        onChange={(e) => {
          setWebsite(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={useGeneratedPassword}
            onChange={(e) => setUseGeneratedPassword(e.target.checked)}
          />
        }
        label="Use Generated Password"
      />
      {useGeneratedPassword && <PasswordGenerator />}
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          width: "100%",
        }}
      >
        Save
      </Button>
    </Box>
  );
}
