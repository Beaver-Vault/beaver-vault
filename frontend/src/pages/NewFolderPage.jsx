import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { useAddFolderMutation } from "../slices/apiSlice";

export default function NewFolderPage({ setModalOpen, refetch }) {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [addFolderPost] = useAddFolderMutation();

  const [folderName, setFolderName] = useState("");

  const handleSubmit = async () => {
    const folderData = {
      folderName: folderName,
      userID: loggedInUser.userID,
    };

    try {
      await addFolderPost(folderData);
      setModalOpen(false);
      dispatch(
        setSnackbar({
          message: "Folder added successfully",
          severity: "success",
        })
      );
      refetch();
    } catch (error) {
      console.error("Error adding folder:", error);
      dispatch(
        setSnackbar({
          message: "An unexpected error occurred. Please try again.",
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
      <Typography variant="h4">Add New Folder</Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Folder Name"
        onChange={(e) => {
          setFolderName(e.target.value);
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
