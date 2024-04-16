import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Box, Button, Typography, IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

const MyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[400],
  "&:hover": {
    backgroundColor: theme.palette.grey[500],
  },
}));

export default function HomePageEntryList() {
  const folders = useSelector((state) => state.userInfo.folders);
  const passwords = useSelector((state) => state.userInfo.passwords);
  const creditCards = useSelector((state) => state.userInfo.creditCards);
  const notes = useSelector((state) => state.userInfo.notes);

  console.log(passwords);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h5">Entries</Typography>
          <IconButton>
            <ControlPointIcon color="primary" />
          </IconButton>
        </Box>
        {folders.map((folder) => {
          return (
            <MyButton
              variant="contained"
              startIcon={<FolderOutlinedIcon />}
              fullWidth
            >
              {folder.folderName}
            </MyButton>
          );
        })}
      </Box>
    </>
  );
}
