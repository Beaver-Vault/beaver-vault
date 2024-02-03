import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { encryptText } from "./encryption";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewPasswordPage() {
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);

  const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const passwordData = {
      folderID: currentFolder,
      websiteName: encryptText(website, loggedInUser.masterKey),
      username: encryptText(username, loggedInUser.masterKey),
      encryptedPassword: encryptText(password, loggedInUser.masterKey),
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/passwords",
      passwordData
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
        onChange={(e) => {
          setWebsite(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
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
