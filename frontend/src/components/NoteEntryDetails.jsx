import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateNoteMutation } from "../slices/apiSlice";
import { setCurrentEntry } from "../slices/uiStatusSlice";
import { Box, Button } from "@mui/material";
import EntryDetailTextField from "./EntryDetailTextField";
import { encryptText } from "../scripts/encryption";

export default function NoteEntryDetails({
  currentEntry,
  isEditing,
  setIsEditing,
  noteRefetch,
}) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [updateNote, updateNoteResult] = useUpdateNoteMutation();
  const [editNoteName, setEditNoteName] = useState(
    currentEntry ? currentEntry.noteName : ""
  );
  const [editContent, setEditContent] = useState(
    currentEntry ? currentEntry.content : ""
  );

  useEffect(() => {
    setEditNoteName(currentEntry ? currentEntry.noteName : "");
    setEditContent(currentEntry ? currentEntry.content : "");
  }, [currentEntry]);

  const handleEdit = async () => {
    const id = currentEntry.noteID;
    const updatedNoteData = {
      folderID: currentEntry.folderID,
      noteName: encryptText(editNoteName, loggedInUser.masterKey),
      content: encryptText(editContent, loggedInUser.masterKey),
    };

    try {
      await updateNote({ notesID: id, updatedData: updatedNoteData });
      alert("Note updated successfully");
      setIsEditing(false);
      noteRefetch();
      dispatch(
        setCurrentEntry({
          ...currentEntry,
          noteName: editNoteName,
          content: editContent,
        })
      );
    } catch (error) {
      console.error("Error updating note:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "80%",
          marginTop: "1rem",
        }}
      >
        <EntryDetailTextField
          label="Note Name"
          entry={currentEntry ? currentEntry.noteName : ""}
          isEditing={isEditing}
          isSecret={false}
          editValue={editNoteName}
          setEditValue={setEditNoteName}
        />
        <EntryDetailTextField
          label="Content"
          entry={currentEntry ? currentEntry.content : ""}
          isEditing={isEditing}
          isSecret={false}
          rows={4}
          editValue={editContent}
          setEditValue={setEditContent}
        />
      </Box>
      {isEditing && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Button variant="contained" onClick={handleEdit}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </>
  );
}
