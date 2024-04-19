import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Box, Button, Typography, IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";

export default function HomePageFolders() {
  const folders = useSelector((state) => state.userInfo.folders);
  const currentFolder = folders[0];

  const MyButton = styled(Button)(({ theme, folder }) => ({
    backgroundColor: currentFolder
      ? currentFolder.folderID == folder.folderID
        ? theme.primary
        : theme.palette.grey[400]
      : theme.palette.grey[400],
    "&:hover": {
      backgroundColor: theme.palette.grey[500],
    },
  }));

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
          <Typography variant="h5">Folders</Typography>
          <IconButton>
            <ControlPointIcon color="primary" />
          </IconButton>
        </Box>
        {folders.map((folder, i) => {
          return (
            <MyButton
              key={i}
              folder={folder}
              variant="contained"
              startIcon={
                currentFolder.folderID == folder.folderID ? (
                  <FolderCopyOutlinedIcon />
                ) : (
                  <FolderOutlinedIcon />
                )
              }
              fullWidth
              sx={{
                marginBottom: "1rem",
              }}
            >
              <Typography variant="h5">{folder.folderName}</Typography>
            </MyButton>
          );
        })}
      </Box>
    </>
  );
}
