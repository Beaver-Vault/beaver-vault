import { Box, Typography, Select, MenuItem, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { encryptText } from "./encryption";
import { useNavigate } from "react-router-dom";

export default function DataImportPage() {
    const loggedInUser = useSelector((state) => state.auth.user);
    const userFolders = useSelector((state) => state.userInfo.folders);
    const Navigate = useNavigate();

    const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedData, setSelectedData] = useState({
        creditCards: false,
        passwords: false,
        notes: false
    });

    const handleCheckboxChange = (event) => {
        setSelectedData({ ...selectedData, [event.target.name]: event.target.checked });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImportData = async () => {
        if (!selectedFile) {
            return;
        }

        try {
            const fileData = await parseJSONFile(selectedFile);

            if (selectedData.passwords) {
                const { passwords } = fileData;
                for (const password of passwords) {
                    const encryptedPasswordData = {
                        folderID: currentFolder,
                        websiteName: encryptText(password.websiteName, loggedInUser.masterKey),
                        username: encryptText(password.username, loggedInUser.masterKey),
                        encryptedPassword: encryptText(password.encryptedPassword, loggedInUser.masterKey),
                    };

                    await axios.post("http://127.0.0.1:8000/passwords", encryptedPasswordData);
                }
            }
            if (selectedData.creditCards) {
                const { creditCards } = fileData;
                for (const creditCard of creditCards) {
                    const encryptedCreditCardData = {
                        folderID: currentFolder,
                        cardName: encryptText(creditCard.cardName, loggedInUser.masterKey),
                        cardholderName: encryptText(creditCard.cardholderName, loggedInUser.masterKey),
                        number: encryptText(creditCard.number, loggedInUser.masterKey),
                        expiration: encryptText(creditCard.expiration, loggedInUser.masterKey),
                        csv: encryptText(creditCard.csv, loggedInUser.masterKey),
                    };

                    await axios.post("http://127.0.0.1:8000/creditcards", encryptedCreditCardData);
                }
            }
            if (selectedData.notes) {
                const { notes } = fileData;
                for (const note of notes) {
                    const encryptedNoteData = {
                        folderID: currentFolder,
                        noteName: encryptText(note.noteName, loggedInUser.masterKey),
                        content: encryptText(note.content, loggedInUser.masterKey),
                    };

                    await axios.post("http://127.0.0.1:8000/notes", encryptedNoteData);
                }
            }

            alert('Data imported successfully');
            Navigate('/')
        } catch (error) {
            console.error('Error importing data:', error);
        }
    };

    const parseJSONFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const fileData = JSON.parse(event.target.result);
                    resolve(fileData);
                } catch (error) {
                    reject('Error parsing JSON file');
                }
            };

            reader.readAsText(file);
        });
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
            <Typography variant="h4">Import Data</Typography>
            <input type="file" onChange={handleFileChange} />
            <FormControlLabel
                control={<Checkbox checked={selectedData.creditCards} onChange={handleCheckboxChange} name="creditCards" />}
                label="Credit Cards"
            />
            <FormControlLabel
                control={<Checkbox checked={selectedData.passwords} onChange={handleCheckboxChange} name="passwords" />}
                label="Passwords"
            />
            <FormControlLabel
                control={<Checkbox checked={selectedData.notes} onChange={handleCheckboxChange} name="notes" />}
                label="Notes"
            />
            <Button
                variant="contained"
                onClick={handleImportData}
                sx={{
                    width: "100%",
                    marginTop: "1rem"
                }}
            >
                Import Data from File
            </Button>
        </Box>
    );
}
