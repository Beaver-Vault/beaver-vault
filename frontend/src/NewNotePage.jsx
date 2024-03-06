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

export default function NewNotePage() {
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
  const [notename, setNotename] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    const noteData = {
      folderID: currentFolder,
      noteName: encryptText(notename, loggedInUser.masterKey),
      content: encryptText(content, loggedInUser.masterKey),
    };

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/notes`, noteData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      alert("Note added successfully");
      navigate("/");
    } else {
      alert("Failed to add note");
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
      <Typography variant="h4">Add New Note</Typography>
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
        label="Note Name"
        onChange={(e) => {
          setNotename(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Content"
        onChange={(e) => {
          setContent(e.target.value);
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
