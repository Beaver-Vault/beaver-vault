import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useUpdateUserMutation,
        useGetPasswordsQuery, 
        useUpdatePasswordMutation, 
        useGetFoldersQuery,
        useUpdateCreditCardMutation } from "../slices/apiSlice";
import { pdfk, encryptText, decryptText } from "../scripts/encryption";
import { useNavigate, useParams} from "react-router-dom";

export default function EditAccountPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [confirmOldPassword, setConfirmOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateUser] = useUpdateUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();
    //const [updateEmail] = useUpdateEmailMutation();
  //const [updateNote] = useUpdateNoteMutation();
  const [updateCreditCard] = useUpdateCreditCardMutation();
  const loggedInUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  
  const { data: folderData } = useGetFoldersQuery(
    loggedInUser["userID"]
  );
  
  const { data: passwords } = useGetPasswordsQuery(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );

  const { data: creditCards } = useUpdateCreditCardMutation(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );
  
  const handleSubmit = async () => {
    if (oldPassword !== confirmOldPassword) {
      alert("Old passwords do not match. Please try again.");
      return;
    }

    const masterKey = pdfk(newPassword, loggedInUser.email);
    const hashedMasterKey = pdfk(masterKey, newPassword);

    const updatedUserData = {
      hashedMasterKey: hashedMasterKey,
      email: loggedInUser.email,
      lastLoginDate: new Date(),
    };

    // update passwords
    for (let password of passwords) {
      let decryptedWebsite = decryptText(password.websiteName, loggedInUser.masterKey);
      let decryptedUsername = decryptText(password.username, loggedInUser.masterKey);
      let decryptedPassword = decryptText(password.encryptedPassword, loggedInUser.masterKey);

      let encryptedWebsite = encryptText(decryptedWebsite, masterKey);
      let encryptedUsername = encryptText(decryptedUsername, masterKey);
      let encryptedPassword = encryptText(decryptedPassword, masterKey);

      // Create the updatedPasswordData object
      const updatedPasswordData = {
        folderID: password.folderID,
        websiteName: encryptedWebsite,
        username: encryptedUsername,
        encryptedPassword: encryptedPassword,
      };
      
      console.log(updatedPasswordData);
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
    let decryptedFolderID = decryptText(card.folderID, loggedInUser.masterKey);

    let encryptedCardName = encryptText(decryptedCardName, masterKey);
    let encryptedCardholderName = encryptText(decryptedCardholderName, masterKey);
    let encryptedNumber = encryptText(decryptedNumber, masterKey);
    let encryptedExpiration = encryptText(decryptedExpiration, masterKey);
    let encryptedCsv = encryptText(decryptedCsv, masterKey);
    let encryptedFolderID = encryptText(decryptedFolderID, masterKey);

    const updatedCreditCardData = {
      folderID: encryptedFolderID,
      cardName: encryptedCardName,
      cardholderName: encryptedCardholderName,
      number: encryptedNumber,
      expiration: encryptedExpiration,
      csv: encryptedCsv,
    };

    await updateCreditCard({
      creditCardID: card.creditCardID,
      updatedData: updatedCreditCardData,
    });
  }




    try {
      await updateUser({
        userID: loggedInUser.userID,
        updatedData: updatedUserData,
      });

      alert("User updated successfully");
      navigate("/logout");
      navigate("/");
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
        height: "60vh",
        margin: "auto",
      }}
    >
      <Typography variant="h5">Change Master Password</Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Old Password"
        type="password"
        value={oldPassword}
        onChange={(e) => {
          setOldPassword(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Confirm Old Password"
        type="password"
        value={confirmOldPassword}
        onChange={(e) => {
          setConfirmOldPassword(e.target.value);
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
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          width: "100%",
        }}
      >
        Change Password
      </Button>
    </Box>
  );
}