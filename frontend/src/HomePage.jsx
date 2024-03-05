import { Box, Tab, Button, IconButton } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import PasswordCell from "./PasswordCell";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFolders,
  setPasswords,
  setCreditCards,
  setNotes,
} from "./slices/userInfoSlice";
import { decryptText } from "./encryption";
import { Edit, Delete } from "@mui/icons-material";
import ConfirmationDialog from "./DeleteConfirmation";
import {
  useGetFoldersQuery,
  useGetPasswordsQuery,
  useGetCreditCardsQuery,
  useGetNotesQuery,
  useDeleteUserMutation,
} from "./slices/apiSlice";

export default function HomePage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("0");
  const [importedData, setImportedData] = useState([]);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletingData, setDeletingData] = useState(null);

  const loggedInUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const allPasswords = useSelector((state) => state.userInfo.passwords);
  const allCreditcards = useSelector((state) => state.userInfo.creditCards);
  const allNotes = useSelector((state) => state.userInfo.notes);

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

  const [deleteUser, deleteUserResult] = useDeleteUserMutation();

  const passwordColumns = [
    { field: "websiteName", headerName: "Website", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "encryptedPassword",
      headerName: "Password",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit("passwords", params.row.passwordID)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete("passwords", params.row.passwordID)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const creditCardColumns = [
    { field: "cardName", headerName: "Card Name", flex: 1 },
    { field: "cardholderName", headerName: "Cardholder Name", flex: 1 },
    {
      field: "number",
      headerName: "Number",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
    { field: "expiration", headerName: "Expiry", flex: 1 },
    {
      field: "csv",
      headerName: "CVV",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit("creditcards", params.row.creditcardID)}
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete("creditcards", params.row.creditcardID)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const notesColumns = [
    { field: "noteName", headerName: "Note Name", flex: 1 },
    { field: "content", headerName: "Content", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit("notes", params.row.noteID)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete("notes", params.row.noteID)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleEdit = (dataType, dataID) => {
    // Navigate to the edit page based on the data type
    switch (dataType) {
      case "passwords":
        nav(`/editpassword/${dataID}`);
        break;
      case "creditcards":
        nav(`/editcreditcard/${dataID}`);
        break;
      case "notes":
        nav(`/editnote/${dataID}`);
        break;
      default:
        console.error("Invalid data type for edit:", dataType);
    }
  };

  const handleDelete = (dataType, dataID) => {
    setDeletingData({ dataType, dataID });
    setConfirmationDialogOpen(true);
  };

  const confirmDeletion = async () => {
    const { dataType, dataID } = deletingData;
    try {
      await deleteUser({ dataType, dataID });
      setConfirmationDialogOpen(false);

      switch (dataType) {
        case "passwords":
          dispatch(
            setPasswords(
              allPasswords.filter((password) => password.passwordID !== dataID)
            )
          );
          break;
        case "creditcards":
          dispatch(
            setCreditCards(
              allCreditcards.filter(
                (creditcard) => creditcard.creditcardID !== dataID
              )
            )
          );
          break;
        case "notes":
          dispatch(setNotes(allNotes.filter((note) => note.noteID !== dataID)));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error deleting ${dataType}:`, error);
    }
  };

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
      <ConfirmationDialog
        open={confirmationDialogOpen}
        handleClose={() => setConfirmationDialogOpen(false)}
        handleConfirm={confirmDeletion}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <Box
          sx={{
            width: "70%",
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <Button
            variant="contained"
            onClick={() => nav("/dataimport")}
            sx={{ marginLeft: "1rem" }}
          >
            Import
          </Button>

          <Button
            variant="contained"
            onClick={() => nav("/dataexport")}
            sx={{ marginLeft: "1rem" }}
          >
            Export
          </Button>

          <label htmlFor="upload" style={{ marginRight: "1rem" }}></label>

          <Button
            variant="contained"
            onClick={() => {
              nav("/encryptiontest");
            }}
          >
            Encryption Tester
          </Button>

          <Button
            variant="contained"
            onClick={() => nav("/cache-test")}
            sx={{ marginLeft: "1rem" }}
          >
            Cache Testing
          </Button>

          <label htmlFor="upload" style={{ marginRight: "1rem" }}></label>
          <label htmlFor="upload" style={{ marginRight: "1rem" }}></label>

          <Button
            variant="contained"
            color="error"
            onClick={() =>
              // console.log(passwordGen(12, true, false, false, false))
              nav("/passwordgen")
            }
          >
            Generate Password
          </Button>
          <Button
            variant="contained"
            sx={{ marginLeft: "1rem" }}
            onClick={() => {
              nav("/newpassword");
            }}
          >
            Add Password
          </Button>

          <Button
            variant="contained"
            sx={{ marginLeft: "1rem" }}
            onClick={() => {
              nav("/newcreditcard");
            }}
          >
            Add Credit Card
          </Button>

          <Button
            variant="contained"
            sx={{ marginLeft: "1rem" }}
            onClick={() => {
              nav("/newnote");
            }}
          >
            Add Note
          </Button>
        </Box>

        <TabContext value={currentTab}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <TabList onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab label="Passwords" value={"0"} />
              <Tab label="Credit Cards" value={"1"} />
              <Tab label="Notes" value={"2"} />
            </TabList>
          </Box>
          <TabPanel
            value={"0"}
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "70%",
                height: "50vh",
                margin: "auto",
              }}
            >
              <DataGrid
                columns={passwordColumns}
                rows={allPasswords}
                getRowId={(row) => row.passwordID}
                autoPageSize
                density="compact"
                disableRowSelectionOnClick
              />
            </Box>
          </TabPanel>

          <TabPanel
            value={"1"}
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "70%",
                height: "50vh",
                margin: "auto",
              }}
            >
              {
                <DataGrid
                  columns={creditCardColumns}
                  rows={allCreditcards}
                  getRowId={(row) => row.creditcardID}
                  autoPageSize
                  density="compact"
                  disableRowSelectionOnClick
                />
              }
            </Box>
          </TabPanel>

          <TabPanel
            value={"2"}
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "70%",
                height: "50vh",
                margin: "auto",
              }}
            >
              {
                <DataGrid
                  columns={notesColumns}
                  rows={allNotes}
                  getRowId={(row) => row.noteID}
                  autoPageSize
                  density="compact"
                  disableRowSelectionOnClick
                />
              }
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
