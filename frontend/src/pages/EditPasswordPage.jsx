import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useSelector } from "react-redux";
import { encryptText, decryptText } from "../scripts/encryption";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPasswordsQuery,
  useUpdatePasswordMutation,
} from "../slices/apiSlice";
import PasswordGenerator from "./PasswordGenPage";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function EditPasswordPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const userFolders = useSelector((state) => state.userInfo.folders);

  const [currentFolder, setCurrentFolder] = useState(
    userFolders.length > 0 ? userFolders[0].folderID : ""
  );
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [useGeneratedPassword, setUseGeneratedPassword] = useState(false);

  const { data: passwordData, refetch: passwordRefetch } =
    useGetPasswordsQuery(currentFolder);
  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();

  // Fetch the password data using the ID
  const fetchPasswordData = async () => {
    passwordRefetch();

    try {
      if (!loggedInUser) {
        console.error("User not logged in");
        navigate("/");
        return;
      }
      if (!passwordData) {
        return;
      }
      // const passwords = response.data;
      const matchedPassword = passwordData.find(
        (password) => password.passwordID === parseInt(id)
      );
      if (!matchedPassword) {
        console.error("Password not found");
        navigate("/");
        return;
      }
      setCurrentFolder(matchedPassword.folderID);
      setWebsite(
        decryptText(matchedPassword.websiteName, loggedInUser.masterKey)
      );
      setUsername(
        decryptText(matchedPassword.username, loggedInUser.masterKey)
      );
      setPassword(
        decryptText(matchedPassword.encryptedPassword, loggedInUser.masterKey)
      );
      setConfirmPassword(
        decryptText(matchedPassword.encryptedPassword, loggedInUser.masterKey)
      );
    } catch (error) {
      console.error("Error fetching password data:", error);
    }
  };

  useEffect(() => {
    fetchPasswordData();
  }, [id, loggedInUser.folderID, passwordData]);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const updatedPasswordData = {
      folderID: currentFolder,
      websiteName: encryptText(website, loggedInUser.masterKey),
      username: encryptText(username, loggedInUser.masterKey),
      encryptedPassword: encryptText(password, loggedInUser.masterKey),
    };

    try {
      await updatePassword({ id, updatedPasswordData });
      alert("Password updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating password:", error);
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
      <Typography variant="h4">Edit Password</Typography>
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
        label="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!passwordsMatch}
        helperText={!passwordsMatch ? "Passwords do not match" : ""}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={useGeneratedPassword}
            onChange={(e) => setUseGeneratedPassword(e.target.checked)}
          />
        }
        label="Use Generated Password"
      />
      {useGeneratedPassword && <PasswordGenerator />}
      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        Save
      </Button>
    </Box>
  );
}
