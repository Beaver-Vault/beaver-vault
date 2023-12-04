import { Box, Tab, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import PasswordCell from "./PasswordCell";
import { fakePasswords, fakeCreditCards } from "./fakedata";
import { useState } from "react";
import { passwordGen } from "./passwordGen";
import { encryptText } from "./encryptText";

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [importedData, setImportedData] = useState([]);

  const passwordColumns = [
    { field: "website", headerName: "Website", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "password",
      headerName: "Password",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
  ];

  const creditCardColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "number",
      headerName: "Number",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
    { field: "expiry", headerName: "Expiry", flex: 1 },
    {
      field: "cvv",
      headerName: "CVV",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
  ];

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
    console.log("exporting data");
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
          <Button
            variant="contained"
            onClick={() =>
              encryptText("beaver", passwordGen(12, true, true, true, true))
            }
          >
            Encrypt "beaver"
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              console.log(passwordGen(12, true, false, false, false))
            }
          >
            Generate Password
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
              <Tab label="Passwords" value={0} />
              <Tab label="Credit Cards" value={1} />
              <Tab label="Notes" value={2} />
            </TabList>
          </Box>
          <TabPanel
            value={0}
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
                rows={fakePasswords}
                autoPageSize
                density="compact"
                disableRowSelectionOnClick
              />
            </Box>
          </TabPanel>
          <TabPanel
            value={1}
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
                columns={creditCardColumns}
                rows={fakeCreditCards}
                autoPageSize
                density="compact"
                disableRowSelectionOnClick
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
