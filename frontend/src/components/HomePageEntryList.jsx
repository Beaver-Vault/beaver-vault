import { styled } from "@mui/material/styles";
import { Box, Button, Typography, IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEntry } from "../slices/uiStatusSlice";

export default function HomePageEntryList() {
  const dispatch = useDispatch();

  const passwords = useSelector((state) => state.userInfo.passwords);
  const creditCards = useSelector((state) => state.userInfo.creditCards);
  const notes = useSelector((state) => state.userInfo.notes);
  const currentEntry = useSelector((state) => state.uiStatus.currentEntry);

  const MyButton = styled(Button)(({ theme, entry }) => ({
    backgroundColor: currentEntry
      ? currentEntry.passwordID == entry.passwordID
        ? theme.primary
        : theme.palette.grey[400]
      : theme.palette.grey[400],
    "&:hover": {
      backgroundColor: currentEntry
        ? currentEntry.passwordID == entry.passwordID
          ? theme.primary
          : theme.palette.grey[500]
        : theme.palette.grey[500],
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
          <Typography variant="h5">Passwords</Typography>
          <IconButton>
            <ControlPointIcon color="primary" />
          </IconButton>
        </Box>
        {passwords.map((password, i) => {
          return (
            <MyButton
              key={i}
              entry={password}
              variant="contained"
              fullWidth
              sx={{
                marginBottom: "1rem",
              }}
              onClick={() => {
                dispatch(setCurrentEntry(password));
              }}
            >
              {password.websiteName}
            </MyButton>
          );
        })}
      </Box>
    </>
  );
}
