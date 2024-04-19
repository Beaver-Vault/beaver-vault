import {
    Box,
    Typography,
    TextField,
    Button,
  } from "@mui/material";
  import { useState } from "react";
  import { useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { useAddFolderMutation } from "./slices/apiSlice";
  
  export default function NewFolderPage() {
    const navigate = useNavigate();
  
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
        alert("Folder added successfully");
        navigate("/");
      } catch (error) {
        console.error("Error adding folder:", error);
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