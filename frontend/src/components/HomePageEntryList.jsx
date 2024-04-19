import { styled } from "@mui/material/styles";
import { Box, Button, ButtonGroup, IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEntry, setCurrentEntryType } from "../slices/uiStatusSlice";
import { useState, useEffect } from "react";
import { EntryTypes } from "../scripts/EntryTypes";

export default function HomePageEntryList() {
  const dispatch = useDispatch();

  const passwords = useSelector((state) => state.userInfo.passwords);
  const creditCards = useSelector((state) => state.userInfo.creditCards);
  const notes = useSelector((state) => state.userInfo.notes);

  const currentEntryType = useSelector(
    (state) => state.uiStatus.currentEntryType
  );
  const currentEntry = useSelector((state) => state.uiStatus.currentEntry);

  const [currentEntries, setCurrentEntries] = useState([]);

  useEffect(() => {
    if (currentEntryType == EntryTypes.PASSWORD) {
      setCurrentEntries(passwords);
    } else if (currentEntryType == EntryTypes.CREDITCARD) {
      setCurrentEntries(creditCards);
    } else if (currentEntryType == EntryTypes.NOTE) {
      setCurrentEntries(notes);
    }
  }, [currentEntryType]);

  const MyButton = styled(Button)(({ theme, entry }) => {
    let isActive = false;
    if (!currentEntry) {
      isActive = false;
    } else if (currentEntryType === EntryTypes.PASSWORD) {
      isActive = currentEntry.passwordID === entry.passwordID;
    } else if (currentEntryType === EntryTypes.CREDITCARD) {
      isActive = currentEntry.creditcardID === entry.creditcardID;
    } else {
      isActive = currentEntry.noteID === entry.noteID;
    }
    return {
      backgroundColor: isActive ? theme.primary : theme.palette.grey[400],
      "&:hover": {
        backgroundColor: isActive ? theme.primary : theme.palette.grey[500],
      },
    };
  });
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              // backgroundColor: "red",
              gap: "2rem",
            }}
          >
            <ButtonGroup>
              <Button
                variant={
                  currentEntryType === EntryTypes.PASSWORD
                    ? "contained"
                    : "outlined"
                }
                onClick={() => {
                  dispatch(setCurrentEntryType(EntryTypes.PASSWORD));
                }}
              >
                PASSWORDS
              </Button>
              <Button
                variant={
                  currentEntryType === EntryTypes.CREDITCARD
                    ? "contained"
                    : "outlined"
                }
                onClick={() => {
                  dispatch(setCurrentEntryType(EntryTypes.CREDITCARD));
                }}
              >
                CREDIT CARDS
              </Button>
              <Button
                variant={
                  currentEntryType === EntryTypes.NOTE
                    ? "contained"
                    : "outlined"
                }
                onClick={() => {
                  dispatch(setCurrentEntryType(EntryTypes.NOTE));
                }}
              >
                NOTES
              </Button>
            </ButtonGroup>
          </Box>
          <IconButton>
            <ControlPointIcon color="primary" />
          </IconButton>
        </Box>
        {currentEntries.map((entry, i) => {
          let displayText = "";
          switch (currentEntryType) {
            case EntryTypes.PASSWORD:
              displayText = entry.websiteName;
              break;
            case EntryTypes.CREDITCARD:
              displayText = entry.cardName;
              break;
            case EntryTypes.NOTE:
              displayText = entry.noteName;
              break;
            default:
              break;
          }

          return (
            <MyButton
              key={i}
              entry={entry}
              variant="contained"
              fullWidth
              sx={{
                marginBottom: "1rem",
              }}
              onClick={() => {
                dispatch(setCurrentEntry(entry));
              }}
            >
              {displayText}
            </MyButton>
          );
        })}
      </Box>
    </>
  );
}
