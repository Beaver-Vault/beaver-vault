import { Box, Tab, Button, IconButton } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import PasswordCell from "../components/PasswordCell";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFolders,
  setPasswords,
  setCreditCards,
  setNotes,
} from "../slices/userInfoSlice";
import { decryptText } from "../scripts/encryption";
import { Cached, Delete } from "@mui/icons-material";
import ConfirmationDialogTrash from "../components/DeleteConfirmationTrash";
import RestoreConfirmationDialog from "../components/RestoreConfirmations";
import {
  useGetFoldersQuery,
  useGetPasswordsQuery,
  useGetCreditCardsQuery,
  useGetNotesQuery,
  useUpdateTrashMutation,
  useDeleteUserMutation,
} from "../slices/apiSlice";

export default function TrashBinPage() {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("0");
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [RestoreconfirmationDialogOpen, setRestoreConfirmationDialogOpen] =
    useState(false);
  const [deletingData, setDeletingData] = useState(null);
  const [restoringData, setRestoringData] = useState(null);

  const loggedInUser = useSelector((state) => state.auth.user);
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

  const [updateTrash] = useUpdateTrashMutation();
  const [deleteUser] = useDeleteUserMutation();

  const passwordColumns = [
    { field: "websiteName", headerName: "Website", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "deletionDateTime", headerName: "Deletion Date", flex: 1 },
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
            onClick={() => handleRestore("passwords", params.row.passwordID)}
          >
            <Cached />
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
    { field: "deletionDateTime", headerName: "Deletion Date", flex: 1 },
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
            onClick={() =>
              handleRestore("creditcards", params.row.creditcardID)
            }
          >
            <Cached />
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
    { field: "deletionDateTime", headerName: "Deletion Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleRestore("notes", params.row.noteID)}>
            <Cached />
          </IconButton>
          <IconButton onClick={() => handleDelete("notes", params.row.noteID)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const handleRestore = (dataType, dataID) => {
    setRestoringData({ dataType, dataID });
    setRestoreConfirmationDialogOpen(true);
  };

  const confirmRestore = async () => {
    const { dataType, dataID } = restoringData;
    try {
      await updateTrash({ dataType, dataID, restore: true });
      setRestoreConfirmationDialogOpen(false);

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
      console.error(`Error updating ${dataType}:`, error);
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

    if (passwordData) {
      console.log("Password Data:", passwordData);
      let passwords = [];
      for (let password of passwordData) {
        if (!password.trashBin) continue;
        passwords.push({
          ...password,
          websiteName: decryptText(
            password.websiteName,
            loggedInUser.masterKey
          ),
          username: decryptText(password.username, loggedInUser.masterKey),
          encryptedPassword: decryptText(
            password.encryptedPassword,
            loggedInUser.masterKey
          ),
          deletionDateTime: new Date(password.deletionDateTime)
            .toISOString()
            .split("T")[0],
        });
      }
      dispatch(setPasswords(passwords));
    }

    if (creditcardData) {
      console.log("Credit Card Data:", creditcardData);
      let creditcards = [];
      for (let creditcard of creditcardData) {
        if (!creditcard.trashBin) continue;
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
          deletionDateTime: new Date(creditcard.deletionDateTime)
            .toISOString()
            .split("T")[0],
        });
      }
      dispatch(setCreditCards(creditcards));
    }

    if (noteData) {
      console.log("Note Data:", noteData);
      let notes = [];
      for (let note of noteData) {
        if (!note.trashBin) continue;
        notes.push({
          noteID: note.noteID,
          noteName: decryptText(note.noteName, loggedInUser.masterKey),
          content: decryptText(note.content, loggedInUser.masterKey),
          deletionDateTime: new Date(note.deletionDateTime)
            .toISOString()
            .split("T")[0],
        });
      }
      dispatch(setNotes(notes));
    }
  }, [loggedInUser, creditcardData, folderData, passwordData, noteData]);

  return (
    <>
      <ConfirmationDialogTrash
        open={confirmationDialogOpen}
        handleClose={() => setConfirmationDialogOpen(false)}
        handleConfirm={confirmDeletion}
      />

      <RestoreConfirmationDialog
        open={RestoreconfirmationDialogOpen}
        handleClose={() => setRestoreConfirmationDialogOpen(false)}
        handleConfirm={confirmRestore}
      />

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
    </>
  );
}
