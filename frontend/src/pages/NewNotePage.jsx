import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { encryptText } from "../scripts/encryption";
import { useAddNoteMutation } from "../slices/apiSlice";

export default function NewNotePage({ setModalOpen, refetch }) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);
  const currentUIFolder = useSelector((state) => state.uiStatus.currentFolder);

  const [addNotePost, noteResult] = useAddNoteMutation();

  const [currentFolder, setCurrentFolder] = useState(currentUIFolder.folderID);
  const [notename, setNotename] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    const noteData = {
      folderID: currentFolder,
      noteName: encryptText(notename, loggedInUser.masterKey),
      content: encryptText(content, loggedInUser.masterKey),
    };

    try {
      await addNotePost(noteData);
      setModalOpen(false);
      dispatch(
        setSnackbar({
          message: "Note added successfully",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      console.error("Error adding note:", error);
      dispatch(
        setSnackbar({
          message: "Failed to add note",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        margin: "auto",
        gap: "2rem",
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
        multiline
        rows={4}
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
