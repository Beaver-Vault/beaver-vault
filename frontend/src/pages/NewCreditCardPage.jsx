import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { encryptText } from "../scripts/encryption";
import { useNavigate } from "react-router-dom";
import { useAddCreditCardMutation } from "../slices/apiSlice";
import cardValidator from "card-validator";

export default function NewCreditCardPage({ setModalOpen, refetch }) {
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);

  const [addCreditCardPost] = useAddCreditCardMutation();

  const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
  const [cardname, setCardname] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [number, setNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [csv, setCsv] = useState("");
  const [numberError, setNumberError] = useState("");
  const [expirationError, setExpirationError] = useState("");
  const [csvError, setCsvError] = useState("");
  const [cardNameError, setCardNameError] = useState("");
  const [cardHolderError, setCardHolderError] = useState("");

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
    const numberValidation = cardValidator.number(newNumber);
    setNumberError(numberValidation.isValid ? "" : "Invalid card number");
  };

  const handleExpirationChange = (e) => {
    const newExpiration = e.target.value;
    setExpiration(newExpiration);
    const expirationValidation = cardValidator.expirationDate(newExpiration);
    setExpirationError(
      expirationValidation.isValid ? "" : "Invalid expiration date"
    );
  };

  const handleCsvChange = (e) => {
    const newCsv = e.target.value;
    setCsv(newCsv);
    const numberValidation = cardValidator.number(number);
    const isAmericanExpress =
      numberValidation.card &&
      numberValidation.card.type === "american-express";

    const cvvValidation = cardValidator.cvv(newCsv, isAmericanExpress ? 4 : 3);
    setCsvError(cvvValidation.isValid ? "" : "Invalid CSV");
  };

  const handleCardNameChange = (e) => {
    const newName = e.target.value;
    setCardname(newName);
    if (newName.trim()) {
      setCardNameError("");
    }
  };

  const handleCardHolderChange = (e) => {
    const newHolder = e.target.value;
    setCardholder(newHolder);
    if (newHolder.trim()) {
      setCardHolderError("");
    }
  };

  const handleSubmit = async () => {
    let valid = true;

    if (!number.trim() || !cardValidator.number(number).isValid) {
      setNumberError("Please enter a valid card number");
      valid = false;
    }

    if (
      !expiration.trim() ||
      !cardValidator.expirationDate(expiration).isValid
    ) {
      setExpirationError("Please enter a valid expiration date");
      valid = false;
    }

    if (
      !csv.trim() ||
      !cardValidator.cvv(
        csv,
        cardValidator.number(number).card &&
          cardValidator.number(number).card.type === "american-express"
          ? 4
          : 3
      ).isValid
    ) {
      setCsvError("Please enter a valid CSV");
      valid = false;
    }

    if (!cardname.trim()) {
      setCardNameError("Card name is required");
      valid = false;
    }

    if (!cardholder.trim()) {
      setCardHolderError("Card holder name is required");
      valid = false;
    }

    if (!valid) {
      alert("Please correct the errors before submitting.");
      return;
    }

    const creditcardData = {
      folderID: currentFolder,
      cardName: encryptText(cardname, loggedInUser.masterKey),
      cardholderName: encryptText(cardholder, loggedInUser.masterKey),
      number: encryptText(number, loggedInUser.masterKey),
      expiration: encryptText(expiration, loggedInUser.masterKey),
      csv: encryptText(csv, loggedInUser.masterKey),
    };

    try {
      await addCreditCardPost(creditcardData);
      setModalOpen(false);
      alert("Credit Card added successfully");
      refetch();
    } catch (error) {
      console.error("Error adding credit card:", error);
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
        width: "100%",
        margin: "auto",
        gap: "2rem",
      }}
    >
      <Typography variant="h4">Add New Credit Card</Typography>
      <Select
        fullWidth
        value={currentFolder}
        onChange={(e) => setCurrentFolder(e.target.value)}
      >
        {userFolders.map((folder, i) => (
          <MenuItem key={i} value={folder.folderID}>
            {folder.folderName}
          </MenuItem>
        ))}
      </Select>
      <TextField
        fullWidth
        variant="outlined"
        label="Card Name"
        value={cardname}
        onChange={handleCardNameChange}
        error={!!cardNameError}
        helperText={cardNameError}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Card Holder"
        value={cardholder}
        onChange={handleCardHolderChange}
        error={!!cardHolderError}
        helperText={cardHolderError}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Card Number"
        value={number}
        onChange={handleNumberChange}
        error={!!numberError}
        helperText={numberError}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Expiration"
        value={expiration}
        onChange={handleExpirationChange}
        error={!!expirationError}
        helperText={expirationError}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="CSV"
        value={csv}
        onChange={handleCsvChange}
        error={!!csvError}
        helperText={csvError}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={
          numberError ||
          expirationError ||
          csvError ||
          cardNameError ||
          cardHolderError
        }
        sx={{
          width: "100%",
        }}
      >
        Save
      </Button>
    </Box>
  );
}
