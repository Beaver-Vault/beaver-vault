import { Box, Button, ButtonGroup, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "website", headerName: "Website", flex: 1 },
  { field: "username", headerName: "Username", flex: 1 },
  {
    field: "password",
    headerName: "Password",
    flex: 1,
    renderCell: () => {
      let showPassword = false;
      return (
        <TextField
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="standard"
          InputProps={{
            readOnly: true,
          }}
          value="test"
        />
      );
    },
  },
];

const fakeData = [
  { id: 1, website: "google.com", username: "test", password: "test" },
  { id: 2, website: "facebook.com", username: "test", password: "test" },
];

export default function HomePage() {
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
        <Box>
          <ButtonGroup>
            <Button variant="contained" color="primary">
              Passwords
            </Button>
            <Button variant="contained" color="primary">
              Credit Card
            </Button>
            <Button variant="contained" color="primary">
              Notes
            </Button>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            width: "70%",
          }}
        >
          <DataGrid columns={columns} rows={fakeData} />
        </Box>
      </Box>
    </>
  );
}
