import { Box, Tab, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import PasswordCell from "./PasswordCell";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setFolders,
  setPasswords,
  setCreditCards,
  setNotes,
} from "./slices/userInfoSlice";
import { decryptText } from "./encryption";

export default function HomePage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("0");

  const loggedInUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const allPasswords = useSelector((state) => state.userInfo.passwords);
  const allCreditcards = useSelector((state) => state.userInfo.creditCards);
  const allNotes = useSelector((state) => state.userInfo.notes);

  const passwordColumns = [
    { field: "websiteName", headerName: "Website", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "encryptedPassword",
      headerName: "Password",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
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
  ];

  const notesColumns = [
    { field: "noteName", headerName: "Note Name", flex: 1 },
    { field: "content", headerName: "Content", flex: 1 },
  ];

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `http://localhost:8000/folders/${loggedInUser["userID"]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const folderData = response.data;

      let totalPasswords = [];
      let totalCreditCards = [];
      let totalNotes = [];

      for (let folder of folderData) {
        const response = await axios.get(
          `http://localhost:8000/passwords/${folder["folderID"]}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        let decryptedPasswords = response.data.map((password) => {
          return {
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
          };
        });
        totalPasswords = totalPasswords.concat(decryptedPasswords);

        const ccresponse = await axios.get(
          `http://localhost:8000/creditcards/${folder["folderID"]}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        let decryptedCreditCards = ccresponse.data.map((creditcard) => {
          return {
            ...creditcard,
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
          };
        });
        totalCreditCards = totalCreditCards.concat(decryptedCreditCards);

        const noteResponse = await axios.get(
          `http://localhost:8000/notes/${folder["folderID"]}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        let decryptedNotes = noteResponse.data.map((note) => {
          return {
            ...note,
            noteName: decryptText(note.noteName, loggedInUser.masterKey),
            content: decryptText(note.content, loggedInUser.masterKey),
          };
        });
        totalNotes = totalNotes.concat(decryptedNotes);
      }
      dispatch(setFolders(folderData));
      dispatch(setPasswords(totalPasswords));
      dispatch(setCreditCards(totalCreditCards));
      dispatch(setNotes(totalNotes));
    };

    getData();
  }, [loggedInUser]);

  return (
    <>
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
