import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { encryptText, decryptText } from "./encryption";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditNotePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [currentFolder, setCurrentFolder] = useState(
    userFolders.length > 0 ? userFolders[0].folderID : ""
  );
  const [notename, setNotename] = useState("");
  const [content, setContent] = useState("");

  const fetchNoteData = async () => {
    try {
      if (!loggedInUser) {
        console.error("User not logged in");
        navigate("/");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/notes/${currentFolder}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const notes = response.data;
      const matchedNote = notes.find((note) => note.noteID === parseInt(id));
      if (!matchedNote) {
        console.error("Note not found");
        navigate("/");
        return;
      }
      setCurrentFolder(matchedNote.folderID);
      setNotename(decryptText(matchedNote.noteName, loggedInUser.masterKey));
      setContent(decryptText(matchedNote.content, loggedInUser.masterKey));
    } catch (error) {
      console.error("Error fetching note data:", error);
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, [id, loggedInUser.folderID]);

  const handleSubmit = async () => {
    const updatedNoteData = {
      folderID: currentFolder,
      noteName: encryptText(notename, loggedInUser.masterKey),
      content: encryptText(content, loggedInUser.masterKey),
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/notes/${id}`,
        updatedNoteData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Note updated successfully");
        navigate("/");
      } else {
        alert("Failed to update note");
        console.error("Error updating note:", response.data);
      }
    } catch (error) {
      console.error("Error updating note:", error);
      alert("An unexpected error occurred. Please try again.");
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
      <Typography variant="h4">Edit Note</Typography>
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
        value={notename}
        onChange={(e) => {
          setNotename(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Content"
        value={content}
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
