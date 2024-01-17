import {
  Typography,
  Box,
  TextField,
  Button,
  Slider,
  Switch,
  IconButton,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { passwordGen } from "./passwordGen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function PasswordGenPage() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [upperCase, setUpperCase] = useState(true);
  const [lowerCase, setLowerCase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [passphrase, setPassphrase] = useState(true);

  const generatePassword = () => {
    const newPassword = passwordGen(
      passwordLength,
      upperCase,
      lowerCase,
      numbers,
      symbols,
      passphrase
    );
    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [
    passwordLength,
    upperCase,
    lowerCase,
    numbers,
    symbols,
    passphrase,
    generatePassword,
  ]);

  const setBool = (e, setFunction) => {
    setFunction(e.target.checked);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          width: "50%",
          margin: "auto",
          padding: "20px",
          // backgroundColor: "red",
        }}
      >
        <Typography variant="h4">Password Generator</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            multiline
          />
          <IconButton onClick={() => navigator.clipboard.writeText(password)}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            width: "70%",
          }}
        >
          <Typography variant="h6">
            Password Length: {passwordLength}
          </Typography>
          <Slider
            defaultValue={12}
            valueLabelDisplay="auto"
            step={1}
            min={8}
            max={100}
            onChange={(e) => setPasswordLength(e.target.value)}
          />
        </Box>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => setBool(e, setUpperCase)}
                checked={upperCase}
              />
            }
            label="Uppercase"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => setBool(e, setLowerCase)}
                checked={lowerCase}
              />
            }
            label="Lowercase"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => setBool(e, setNumbers)}
                checked={numbers}
              />
            }
            label="Numbers"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => setBool(e, setPassphrase)}
                checked={passphrase}
              />
            }
            label="Passphrase"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => setBool(e, setSymbols)}
                checked={symbols}
              />
            }
            label="Symbols"
          />
        </FormGroup>
        <Button variant="contained" onClick={generatePassword}>
          Generate
        </Button>
      </Box>
    </>
  );
}
