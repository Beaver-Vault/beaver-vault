import { Box, Typography, Select, MenuItem, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { decryptText } from "./encryption";

export default function DataExportPage() {
    const loggedInUser = useSelector((state) => state.auth.user);
    const userFolders = useSelector((state) => state.userInfo.folders);

    const [currentFolder, setCurrentFolder] = useState(userFolders[0].folderID);
    const [selectedData, setSelectedData] = useState({
        creditCards: false,
        passwords: false,
        notes: false
    });

    const handleCheckboxChange = (event) => {
        setSelectedData({ ...selectedData, [event.target.name]: event.target.checked });
    };

    const handleDownloadData = async () => {
        try {
            const dataToFetch = [];
            const decryptedData = {};
    
            if (selectedData.passwords) {
                const response = await axios.get(`http://localhost:8000/passwords/${currentFolder}`);
                const decryptedPasswords = response.data.map(password => {
                    const { passwordID, folderID, ...rest } = password;
                    return {
                        ...rest,
                        websiteName: decryptText(password.websiteName, loggedInUser.masterKey),
                        username: decryptText(password.username, loggedInUser.masterKey),
                        encryptedPassword: decryptText(password.encryptedPassword, loggedInUser.masterKey),
                    };
                });
                decryptedData.passwords = decryptedPasswords;
            }
    
            if (selectedData.creditCards) {
                const response = await axios.get(`http://localhost:8000/creditcards/${currentFolder}`);
                const decryptedCreditCards = response.data.map(creditcard => {
                    const { creditcardID, folderID, ...rest } = creditcard;
                    return {
                        ...rest,
                        cardName: decryptText(creditcard.cardName, loggedInUser.masterKey),
                        cardholderName: decryptText(creditcard.cardholderName, loggedInUser.masterKey),
                        number: decryptText(creditcard.number, loggedInUser.masterKey),
                        expiration: decryptText(creditcard.expiration, loggedInUser.masterKey),
                        csv: decryptText(creditcard.csv, loggedInUser.masterKey),
                    };
                });
                decryptedData.creditCards = decryptedCreditCards;
            }
    
            if (selectedData.notes) {
                const response = await axios.get(`http://localhost:8000/notes/${currentFolder}`);
                const decryptedNotes = response.data.map(note => {
                    const { noteID, folderID, ...rest } = note;
                    return {
                        ...rest,
                        noteName: decryptText(note.noteName, loggedInUser.masterKey),
                        content: decryptText(note.content, loggedInUser.masterKey),
                    };
                });
                decryptedData.notes = decryptedNotes;
            }
    
            const jsonData = JSON.stringify(decryptedData, null, 2);
    
            const blob = new Blob([jsonData], { type: "application/json" });

            const url = URL.createObjectURL(blob);
    
            const link = document.createElement("a");
            link.href = url;
            link.download = "exported_data.json";
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading data:", error);
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
            <Typography variant="h4">Download Folder Data</Typography>
            <Select
                fullWidth
                value={currentFolder}
                onChange={(e) => setCurrentFolder(e.target.value)}
            >
                {userFolders.map((folder) => (
                    <MenuItem key={folder.folderID} value={folder.folderID}>
                        {folder.folderName}
                    </MenuItem>
                ))}
            </Select>
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
                onClick={handleDownloadData}
                sx={{
                    width: "100%",
                    marginTop: "1rem"
                }}
            >
                Download Selected Data
            </Button>
        </Box>
    );
}
