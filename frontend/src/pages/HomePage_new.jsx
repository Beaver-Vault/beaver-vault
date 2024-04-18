import { useEffect } from "react";
import { Box, Button, Grid, Divider } from "@mui/material";
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
import HomePageEntryDetails from "../components/HomePageEntryDetails";

export default function HomePage_new() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);

  const {
    data: folderData,
    refetch: folderRefetch,
    status: folderStatus,
  } = useGetFoldersQuery(loggedInUser["userID"]);

  const {
    data: passwordData,
    refetch: passwordRefetch,
    status: passwordStatus,
  } = useGetPasswordsQuery(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );

  const {
    data: creditcardData,
    refetch: creditcardRefetch,
    status: creditcardStatus,
  } = useGetCreditCardsQuery(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );

  const {
    data: noteData,
    refetch: noteRefetch,
    status: noteStatus,
  } = useGetNotesQuery(
    folderData ? folderData.map((folder) => folder.folderID) : [-1]
  );

  useEffect(() => {
    folderRefetch();
    if (folderStatus === "fulfilled") dispatch(setFolders(folderData));
    passwordRefetch();
    if (passwordStatus === "fulfilled") dispatch(setPasswords(passwordData));
    creditcardRefetch();
    if (creditcardStatus === "fulfilled")
      dispatch(setCreditCards(creditcardData));
    noteRefetch();
    if (noteStatus === "fulfilled") dispatch(setNotes(noteData));

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
    // }, [loggedInUser, creditcardData, folderData, passwordData, noteData]);
  }, [loggedInUser, folderData, passwordData, creditcardData, noteData]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
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
          <Button variant="contained">Passwords</Button>
          <Button variant="outlined">Credit Cards</Button>
          <Button variant="outlined">Notes</Button>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{
            marginTop: "1rem",
          }}
        >
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
              <HomePageEntryDetails />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
