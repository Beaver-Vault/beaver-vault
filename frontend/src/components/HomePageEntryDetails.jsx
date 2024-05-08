import { Box, Typography, IconButton, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import ConfirmationDialog from "./DeleteConfirmation";
import PasswordEntryDetails from "./PasswordEntryDetails";
import CreditCardEntryDetails from "./CreditCardEntryDetails";
import NoteEntryDetails from "./NoteEntryDetails";
import {
  setPasswords,
  setCreditCards,
  setNotes,
} from "../slices/userInfoSlice";
import { setCurrentEntry } from "../slices/uiStatusSlice";
import {
  useUpdateTrashMutation,
  useDeleteUserMutation,
} from "../slices/apiSlice";
import { EntryTypes } from "../scripts/EntryTypes";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function HomePageEntryDetails({
  passwordRefetch,
  creditcardRefetch,
  noteRefetch,
}) {
  const dispatch = useDispatch();

  const { currentEntry, currentEntryType, currentFolder } = useSelector(
    (state) => state.uiStatus
  );

  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletingData, setDeletingData] = useState(null);
  const allPasswords = useSelector((state) => state.userInfo.passwords);
  const allCreditcards = useSelector((state) => state.userInfo.creditCards);
  const allNotes = useSelector((state) => state.userInfo.notes);

  const [deleteUser] = useDeleteUserMutation();
  const [updateTrash] = useUpdateTrashMutation();

  useEffect(() => {
    setIsEditing(false);
    dispatch(setCurrentEntry(null));
  }, [currentFolder]);

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

  const handleDelete = (entryType, entry) => {
    if (entryType === "PASSWORD") {
      setDeletingData({ dataType: "passwords", dataID: entry.passwordID });
    } else if (entryType === "CREDITCARD") {
      setDeletingData({ dataType: "creditcards", dataID: entry.creditcardID });
    } else if (entryType === "NOTE") {
      setDeletingData({ dataType: "notes", dataID: entry.noteID });
    }
    // console.log(entry);
    setConfirmationDialogOpen(true);
  };

  const confirmDeletion = async () => {
    const { dataType, dataID } = deletingData;
    try {
      await deleteUser({ dataType, dataID });
      setConfirmationDialogOpen(false);

      switch (dataType) {
        case "passwords":
          dispatch(
            setPasswords(
              allPasswords.filter((password) => password.passwordID !== dataID)
            )
          );
          break;
        case "creditcards":
          dispatch(
            setCreditCards(
              allCreditcards.filter(
                (creditcard) => creditcard.creditcardID !== dataID
              )
            )
          );
          break;
        case "notes":
          dispatch(setNotes(allNotes.filter((note) => note.noteID !== dataID)));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error deleting ${dataType}:`, error);
    }
  };

  const confirmTrashBin = async () => {
    const { dataType, dataID } = deletingData;
    try {
      await updateTrash({ dataType, dataID, restore: false });
      setConfirmationDialogOpen(false);

      switch (dataType) {
        case "passwords":
          dispatch(
            setPasswords(
              allPasswords.filter((password) => password.passwordID !== dataID)
            )
          );
          break;
        case "creditcards":
          dispatch(
            setCreditCards(
              allCreditcards.filter(
                (creditcard) => creditcard.creditcardID !== dataID
              )
            )
          );
          break;
        case "notes":
          dispatch(setNotes(allNotes.filter((note) => note.noteID !== dataID)));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error updating ${dataType}:`, error);
    }
  };

  return (
    <>
      <ConfirmationDialog
        open={confirmationDialogOpen}
        handleClose={() => setConfirmationDialogOpen(false)}
        handleConfirm={confirmDeletion}
        handle30DayTrashBin={confirmTrashBin}
      />
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
          <IconButton
            onClick={() => {
              handleDelete(currentEntryType, currentEntry);
            }}
          >
            <DeleteIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
      {currentEntryType === EntryTypes.PASSWORD ? (
        <PasswordEntryDetails
          currentEntry={currentEntry}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          passwordRefetch={passwordRefetch}
        />
      ) : currentEntryType === EntryTypes.CREDITCARD ? (
        <CreditCardEntryDetails
          currentEntry={currentEntry}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          creditcardRefetch={creditcardRefetch}
        />
      ) : (
        <NoteEntryDetails
          currentEntry={currentEntry}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          noteRefetch={noteRefetch}
        />
      )}
    </>
  );
}
