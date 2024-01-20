import { deriveKey, encryptText, decryptText } from "./encryption";
import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";

export default function EncryptionTestPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [textToEncrypt, setTextToEncrypt] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          margin: "auto",
          width: "80%",
        }}
      >
        <TextField
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            if (password === "" || email === "") return;
            setKey(deriveKey(password, email));
          }}
        >
          Derive Key
        </Button>
        <TextField
          label="Key"
          value={key}
          fullWidth
          multiline
          onChange={(e) => {
            setKey(e.target.value);
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          margin: "auto",
          width: "80%",
          padding: "1rem",
        }}
      >
        <TextField
          label="Text"
          fullWidth
          multiline
          onChange={(e) => {
            setTextToEncrypt(e.target.value);
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            setEncryptedText(encryptText(textToEncrypt, key));
          }}
        >
          Encrypt
        </Button>
        <TextField
          label="Encrypted Text"
          fullWidth
          multiline
          value={encryptedText}
          onChange={(e) => {
            setEncryptedText(e.target.value);
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            setDecryptedText(decryptText(encryptedText, key));
          }}
        >
          Decrypt
        </Button>
        <TextField
          label="Decrypted Text"
          fullWidth
          multiline
          value={decryptedText}
        />
      </Box>
    </>
  );
}
