import { Box, Button, ButtonGroup, Tabs, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PasswordCell from "./PasswordCell";
import { fakePasswords } from "./fakedata";
import { useState } from "react";

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState(0);

  const columns = [
    { field: "website", headerName: "Website", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "password",
      headerName: "Password",
      flex: 1,
      renderCell: (e) => <PasswordCell password={e.value} />,
    },
  ];

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
        <Tabs value={currentTab}>
          <Tab label="Passwords" />
          <Tab label="Credit Cards" />
          <Tab label="Notes" />
        </Tabs>
        <Box
          sx={{
            width: "70%",
            height: "70vh",
          }}
        >
          <DataGrid
            columns={columns}
            rows={fakePasswords}
            autoPageSize
            density="compact"
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </>
  );
}
