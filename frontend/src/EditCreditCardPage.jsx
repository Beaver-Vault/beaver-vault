import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { encryptText, decryptText } from "./encryption";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditNotePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [currentFolder, setCurrentFolder] = useState(
    userFolders.length > 0 ? userFolders[0].folderID : ""
  );
  const [cardname, setCardname] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [number, setNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [csv, setCsv] = useState("");

  const fetchCreditCardData = async () => {
    try {
      if (!loggedInUser) {
        console.error("User not logged in");
        navigate("/");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/creditcards/${currentFolder}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const creditcards = response.data;
      const matchedCard = creditcards.find(
        (card) => card.creditcardID === parseInt(id)
      );
      if (!matchedCard) {
        console.error("Credit Card not found");
        navigate("/");
        return;
      }
      setCurrentFolder(matchedCard.folderID);
      setCardname(decryptText(matchedCard.cardName, loggedInUser.masterKey));
      setCardholder(
        decryptText(matchedCard.cardholderName, loggedInUser.masterKey)
      );
      setNumber(decryptText(matchedCard.number, loggedInUser.masterKey));
      setExpiration(
        decryptText(matchedCard.expiration, loggedInUser.masterKey)
      );
      setCsv(decryptText(matchedCard.csv, loggedInUser.masterKey));
    } catch (error) {
      console.error("Error fetching credit card data:", error);
    }
  };

  useEffect(() => {
    fetchCreditCardData();
  }, [id, loggedInUser.folderID]);

  const handleSubmit = async () => {
    const updatedCardData = {
      folderID: currentFolder,
      cardName: encryptText(cardname, loggedInUser.masterKey),
      cardholderName: encryptText(cardholder, loggedInUser.masterKey),
      number: encryptText(number, loggedInUser.masterKey),
      expiration: encryptText(expiration, loggedInUser.masterKey),
      csv: encryptText(csv, loggedInUser.masterKey),
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/creditcards/${id}`,
        updatedCardData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Credit Card updated successfully");
        navigate("/");
      } else {
        alert("Failed to update card");
        console.error("Error updating card:", response.data);
      }
    } catch (error) {
      console.error("Error updating card:", error);
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
      <Typography variant="h4">Edit Credit Card</Typography>
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
        label="Card Name"
        value={cardname}
        onChange={(e) => {
          setCardname(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Card Holder"
        value={cardholder}
        onChange={(e) => {
          setCardholder(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Card Number"
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Expiration"
        value={expiration}
        onChange={(e) => {
          setExpiration(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="CSV"
        value={csv}
        onChange={(e) => {
          setCsv(e.target.value);
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
