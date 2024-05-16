import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation, useGetPasswordsQuery, useGetNotesQuery, useGetCreditCardsQuery, useUpdatePasswordMutation, useGetFoldersQuery, useUpdateCreditCardMutation, useUpdateNoteMutation } from "../slices/apiSlice";
import { pdfk, encryptText, decryptText } from "../scripts/encryption";
import { useNavigate } from "react-router-dom";
import { logout } from '../slices/authSlice';

export default function EditAccountPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Added confirm new master password state
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [updateCreditCard] = useUpdateCreditCardMutation();
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const { data: folderData } = useGetFoldersQuery(loggedInUser["userID"]);
  const { data: passwords } = useGetPasswordsQuery(folderData ? folderData.map((folder) => folder.folderID) : [-1]);
  const { data: creditCards } = useGetCreditCardsQuery(folderData ? folderData.map((folder) => folder.folderID) : [-1]);
  const { data: notes } = useGetNotesQuery(folderData ? folderData.map((folder) => folder.folderID) : [-1]);

  const handleSubmit = async () => {
    // compare hashes of old password to master key
    if (pdfk(oldPassword, loggedInUser.email) !== loggedInUser.masterKey) {
      alert("Invalid current password entered. Please try again.");
      return;
    }

    if (newPassword !== confirmNewPassword) { // Check if new passwords match
      alert("New passwords do not match. Please try again.");
      return;
    }

    if (newEmail !== confirmNewEmail) {
      alert("New emails do not match. Please try again.");
      return;
    }

    // Check if email needs to change; default to current email
    console.log("logged in user", loggedInUser.email)
    let emailToUse = loggedInUser.email;

    if (newEmail === confirmNewEmail && newEmail.trim() !== '') {
      emailToUse = newEmail;
    }
    
    const masterKey = pdfk(newPassword, emailToUse);
    const hashedMasterKey = pdfk(masterKey, newPassword);

    const updatedUserData = {
      hashedMasterKey: hashedMasterKey,
      email: emailToUse,
      lastLoginDate: new Date(),
    };

    // Update passwords
    for (let password of passwords) {
      let decryptedWebsite = decryptText(password.websiteName, loggedInUser.masterKey);
      let decryptedUsername = decryptText(password.username, loggedInUser.masterKey);
      let decryptedPassword = decryptText(password.encryptedPassword, loggedInUser.masterKey);

      let encryptedWebsite = encryptText(decryptedWebsite, masterKey);
      let encryptedUsername = encryptText(decryptedUsername, masterKey);
      let encryptedPassword = encryptText(decryptedPassword, masterKey);

      const updatedPasswordData = {
        folderID: password.folderID,
        websiteName: encryptedWebsite,
        username: encryptedUsername,
        encryptedPassword: encryptedPassword,
      };

      await updatePassword({
        id: password.passwordID,
        updatedPasswordData
      });
    }

    // Update credit cards
    for (let card of creditCards) {
      let decryptedCardName = decryptText(card.cardName, loggedInUser.masterKey);
      let decryptedCardholderName = decryptText(card.cardholderName, loggedInUser.masterKey);
      let decryptedNumber = decryptText(card.number, loggedInUser.masterKey);
      let decryptedExpiration = decryptText(card.expiration, loggedInUser.masterKey);
      let decryptedCsv = decryptText(card.csv, loggedInUser.masterKey);

      let encryptedCardName = encryptText(decryptedCardName, masterKey);
      let encryptedCardholderName = encryptText(decryptedCardholderName, masterKey);
      let encryptedNumber = encryptText(decryptedNumber, masterKey);
      let encryptedExpiration = encryptText(decryptedExpiration, masterKey);
      let encryptedCsv = encryptText(decryptedCsv, masterKey);

      const updatedCreditCardData = {
        folderID: card.folderID,
        cardName: encryptedCardName,
        cardholderName: encryptedCardholderName,
        number: encryptedNumber,
        expiration: encryptedExpiration,
        csv: encryptedCsv,
      };

      await updateCreditCard({
        creditCardID: card.creditcardID,
        updatedData: updatedCreditCardData,
      });
    }

    // Update notes
    for (let note of notes) {
      let decryptedNoteName = decryptText(note.noteName, loggedInUser.masterKey);
      let decryptedNoteContent = decryptText(note.content, loggedInUser.masterKey);

      let encryptedNoteName = encryptText(decryptedNoteName, masterKey);
      let encryptedNoteContent = encryptText(decryptedNoteContent, masterKey);

      console.log(note.noteID)
      const updatedNoteData = {
        folderID: note.folderID,
        noteName: encryptedNoteName,
        content: encryptedNoteContent,
      };

      await updateNote({
        notesID: note.noteID,
        updatedData: updatedNoteData,
      });
    }

    try {
      await updateUser({
        userID: loggedInUser.userID,
        updatedData: updatedUserData,
      });

      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An unexpected error occurred while updating the master password. Please try again.");
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
        height: "50vh",
        margin: "auto",
      }}
    >
      <Typography variant="h5">Change Master Password</Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Current Password"
        type="password"
        value={oldPassword}
        onChange={(e) => {
          setOldPassword(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="New Master Password"
        type="password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Confirm New Master Password" // Added confirm new master password field
        type="password"
        value={confirmNewPassword}
        onChange={(e) => {
          setConfirmNewPassword(e.target.value);
        }}
      />

      <Typography variant="h5">Change Email (Optional)</Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="New Email"
        type="email"
        value={newEmail}
        onChange={(e) => {
          setNewEmail(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Confirm New Email"
        type="email"
        value={confirmNewEmail}
        onChange={(e) => {
          setConfirmNewEmail(e.target.value);
        }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          width: "100%",
        }}
      >
        Change Password/Email
      </Button>
    </Box>
  );
}
