import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import PasswordEntryDetails from "./PasswordEntryDetails";
import CreditCardEntryDetails from "./CreditCardEntryDetails";
import NoteEntryDetails from "./NoteEntryDetails";
import { EntryTypes } from "../scripts/EntryTypes";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function HomePageEntryDetails() {
  const { currentEntry, currentEntryType } = useSelector(
    (state) => state.uiStatus
  );

  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    switch (currentEntryType) {
      case EntryTypes.PASSWORD:
        setTitle("Password Details");
        break;
      case EntryTypes.CREDITCARD:
        setTitle("Credit Card Details");
        break;
      case EntryTypes.NOTE:
        setTitle("Note Details");
        break;
      default:
        setTitle("Entry Details");
    }
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
        }}
      >
        <div></div>
        <Typography variant="h5">{title}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
          }}
        >
          <IconButton onClick={() => setIsEditing(!isEditing)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton>
            <DeleteIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
      {currentEntryType === EntryTypes.PASSWORD ? (
        <PasswordEntryDetails currentEntry={currentEntry} />
      ) : currentEntryType === EntryTypes.CREDITCARD ? (
        <CreditCardEntryDetails currentEntry={currentEntry} />
      ) : (
        <NoteEntryDetails currentEntry={currentEntry} />
      )}
    </>
  );
}
