import { Box, Tab, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import PasswordCell from "./PasswordCell";
import { fakePasswords, fakeCreditCards } from "./fakedata";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage({ loggedInUser }) {
  const nav = useNavigate();

  const [currentTab, setCurrentTab] = useState("0");
  const [importedData, setImportedData] = useState([]);
  const [userFolders, setUserFolders] = useState([]);

  // const passwordColumns = [
  //   { field: "website", headerName: "Website", flex: 1 },
  //   { field: "username", headerName: "Username", flex: 1 },
  //   {
  //     field: "password",
  //     headerName: "Password",
  //     flex: 1,
  //     renderCell: (e) => <PasswordCell password={e.value} />,
  //   },
  // ];

  // const creditCardColumns = [
  //   { field: "name", headerName: "Name", flex: 1 },
  //   {
  //     field: "number",
  //     headerName: "Number",
  //     flex: 1,
  //     renderCell: (e) => <PasswordCell password={e.value} />,
  //   },
  //   { field: "expiry", headerName: "Expiry", flex: 1 },
  //   {
  //     field: "cvv",
  //     headerName: "CVV",
  //     flex: 1,
  //     renderCell: (e) => <PasswordCell password={e.value} />,
  //   },
  // ];

  useEffect(() => {
    const getFolders = async () => {
      const response = await axios.get(
        `http://localhost:8000/folders/${loggedInUser["userID"]}`
      );
      setUserFolders(response.data);
    };

    getFolders();
  }, [loggedInUser, setUserFolders]);

  const importData = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          if (
            Array.isArray(importedData) &&
            importedData.every(
              (row) => row.website && row.username && row.password
            )
          ) {
            setImportedData(importedData);
            console.log("Import success! Data:", importedData);
          } else {
            console.error(
              "Import failed. Invalid JSON format or missing required fields."
            );
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  const exportData = () => {
    const chosenData = window.prompt(
      'Enter "passwords", "credit", or "all" to export data:'
    );

    let dataToExport;

    if (chosenData === "passwords") {
      dataToExport = fakePasswords;
    } else if (chosenData === "credit") {
      dataToExport = fakeCreditCards;
    } else if (chosenData === "all") {
      dataToExport = {
        passwords: fakePasswords,
        creditCards: fakeCreditCards,
      };
    } else {
      console.log("Invalid selection. No data exported.");
      return;
    }

    const jsonData = JSON.stringify(dataToExport, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });

    const exportingData = document.createElement("a");
    exportingData.href = URL.createObjectURL(blob);

    exportingData.download = `exported_data_${chosenData}.json`;

    document.body.appendChild(exportingData);

    exportingData.click();

    document.body.removeChild(exportingData);

    console.log(`Data (${chosenData}) exported successfully`);
  };

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
          <label htmlFor="upload" style={{ marginRight: "1rem" }}>
            <Button component="span" variant="contained">
              Import
            </Button>
            <input
              type="file"
              id="upload"
              accept=".json"
              style={{ display: "none" }}
              onChange={importData}
            />
          </label>

          <Button variant="contained" onClick={exportData}>
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
              {/* <DataGrid
                columns={passwordColumns}
                rows={fakePasswords}
                autoPageSize
                density="compact"
                disableRowSelectionOnClick
              /> */}
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
              {/* <DataGrid
                columns={creditCardColumns}
                rows={fakeCreditCards}
                autoPageSize
                density="compact"
                disableRowSelectionOnClick
              /> */}
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
