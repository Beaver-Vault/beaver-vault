import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { encryptText } from "./encryption";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewCreditCardPage() {
  const navigate = useNavigate();

  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
  const [cardname, setCardname] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [number, setNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [csv, setCsv] = useState("");

  const handleSubmit = async () => {
    const creditcardData = {
      folderID: currentFolder,
      cardName: encryptText(cardname, loggedInUser.masterKey),
      cardholderName: encryptText(cardholder, loggedInUser.masterKey),
      number: encryptText(number, loggedInUser.masterKey),
      expiration: encryptText(expiration, loggedInUser.masterKey),
      csv: encryptText(csv, loggedInUser.masterKey),
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/creditcards",
      creditcardData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      alert("Credit Card added successfully");
      navigate("/");
    } else {
      alert("Failed to add Credit Card");
      console.log(response.data);
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
      <Typography variant="h4">Add New Credit Card</Typography>
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
        onChange={(e) => {
          setCardname(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Card Holder"
        onChange={(e) => {
          setCardholder(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Card Number"
        onChange={(e) => {
          setNumber(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Expiration"
        onChange={(e) => {
          setExpiration(e.target.value);
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="CSV"
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
