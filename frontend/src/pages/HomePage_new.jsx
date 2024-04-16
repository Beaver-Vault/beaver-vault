import { useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { decryptText } from "../scripts/encryption";
import {
  setFolders,
  setPasswords,
  setCreditCards,
  setNotes,
} from "../slices/userInfoSlice";
import {
  useGetFoldersQuery,
  useGetPasswordsQuery,
  useGetCreditCardsQuery,
  useGetNotesQuery,
} from "../slices/apiSlice";
import HomePageFolders from "../components/HomePageFolders";
import HomePageEntryList from "../components/HomePageEntryList";

export default function HomePage_new() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const { data: folderData, refetch: folderRefetch } = useGetFoldersQuery(
    loggedInUser["userID"]
  );

  const { data: passwordData, refetch: passwordRefetch } = useGetPasswordsQuery(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );

  const { data: creditcardData, refetch: creditcardRefetch } =
    useGetCreditCardsQuery(
      folderData ? folderData.map((folder) => folder.folderID) : [-1]
    );

  const { data: noteData, refetch: noteRefetch } = useGetNotesQuery(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );

  useEffect(() => {
    folderRefetch();
    passwordRefetch();
    creditcardRefetch();
    noteRefetch();

    dispatch(setFolders(folderData));

    // Decrypt Passwords
    if (passwordData) {
      let passwords = [];
      for (let password of passwordData) {
        if (password.trashBin) continue;
        passwords.push({
          passwordID: password.passwordID,
          websiteName: decryptText(
            password.websiteName,
            loggedInUser.masterKey
          ),
          username: decryptText(password.username, loggedInUser.masterKey),
          encryptedPassword: decryptText(
            password.encryptedPassword,
            loggedInUser.masterKey
          ),
        });
      }
      dispatch(setPasswords(passwords));
    }

    // Decrypt Credit Cards
    if (creditcardData) {
      let creditcards = [];
      for (let creditcard of creditcardData) {
        if (creditcard.trashBin) continue;
        creditcards.push({
          creditcardID: creditcard.creditcardID,
          cardName: decryptText(creditcard.cardName, loggedInUser.masterKey),
          cardholderName: decryptText(
            creditcard.cardholderName,
            loggedInUser.masterKey
          ),
          number: decryptText(creditcard.number, loggedInUser.masterKey),
          expiration: decryptText(
            creditcard.expiration,
            loggedInUser.masterKey
          ),
          csv: decryptText(creditcard.csv, loggedInUser.masterKey),
        });
      }
      dispatch(setCreditCards(creditcards));
    }

    // Decrypt Notes
    if (noteData) {
      let notes = [];
      for (let note of noteData) {
        if (note.trashBin) continue;
        notes.push({
          noteID: note.noteID,
          noteName: decryptText(note.noteName, loggedInUser.masterKey),
          content: decryptText(note.content, loggedInUser.masterKey),
        });
      }
      dispatch(setNotes(notes));
    }
  }, [loggedInUser, creditcardData, folderData, passwordData, noteData]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          //   backgroundColor: "green",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            // backgroundColor: "red",
            gap: "2rem",
          }}
        >
          <Button variant="outlined">Passwords</Button>
          <Button variant="outlined">Credit Cards</Button>
          <Button variant="outlined">Notes</Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              sx={{
                // backgroundColor: "blue",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomePageFolders />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                // backgroundColor: "blue",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomePageEntryList />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                // backgroundColor: "blue",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5">Entry Details</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
