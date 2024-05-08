import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button } from "@mui/material";
import { useUpdatePasswordMutation } from "../slices/apiSlice";
import { setCurrentEntry } from "../slices/uiStatusSlice";
import EntryDetailTextField from "./EntryDetailTextField";
import { encryptText } from "../scripts/encryption";

export default function PasswordEntryDetails({
  currentEntry,
  isEditing,
  setIsEditing,
  passwordRefetch,
}) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);

  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();
  const [editWebsiteName, setEditWebsiteName] = useState(
    currentEntry ? currentEntry.websiteName : ""
  );
  const [editUsername, setEditUsername] = useState(
    currentEntry ? currentEntry.username : ""
  );
  const [editPassword, setEditPassword] = useState(
    currentEntry ? currentEntry.encryptedPassword : ""
  );

  useEffect(() => {
    setEditWebsiteName(currentEntry ? currentEntry.websiteName : "");
    setEditUsername(currentEntry ? currentEntry.username : "");
    setEditPassword(currentEntry ? currentEntry.encryptedPassword : "");
  }, [currentEntry]);

  const handleEdit = async () => {
    const id = currentEntry.passwordID;
    const updatedPasswordData = {
      folderID: currentEntry.folderID,
      websiteName: encryptText(editWebsiteName, loggedInUser.masterKey),
      username: encryptText(editUsername, loggedInUser.masterKey),
      encryptedPassword: encryptText(editPassword, loggedInUser.masterKey),
    };

    try {
      await updatePassword({ id, updatedPasswordData });
      alert("Password updated successfully");
      setIsEditing(false);
      passwordRefetch();
      dispatch(
        setCurrentEntry({
          ...currentEntry,
          websiteName: editWebsiteName,
          username: editUsername,
          encryptedPassword: editPassword,
        })
      );
    } catch (error) {
      console.error("Error updating password:", error);
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
          label="Website"
          entry={currentEntry ? currentEntry.websiteName : ""}
          isEditing={isEditing}
          isSecret={false}
          editValue={editWebsiteName}
          setEditValue={setEditWebsiteName}
        />
        <EntryDetailTextField
          label="Username"
          entry={currentEntry ? currentEntry.username : ""}
          isEditing={isEditing}
          isSecret={false}
          editValue={editUsername}
          setEditValue={setEditUsername}
        />
        <EntryDetailTextField
          label="Password"
          entry={currentEntry ? currentEntry.encryptedPassword : ""}
          isEditing={isEditing}
          isSecret={true}
          editValue={editPassword}
          setEditValue={setEditPassword}
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
