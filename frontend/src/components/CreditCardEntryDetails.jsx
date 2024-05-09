import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSnackbar } from "../slices/snackbarSlice";
import { useUpdateCreditCardMutation } from "../slices/apiSlice";
import { setCurrentEntry } from "../slices/uiStatusSlice";
import { Box, Button } from "@mui/material";
import EntryDetailTextField from "./EntryDetailTextField";
import { encryptText } from "../scripts/encryption";

export default function CreditCardEntryDetails({
  currentEntry,
  isEditing,
  setIsEditing,
  creditcardRefetch,
}) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [updateCreditCard, updateCreditCardResult] =
    useUpdateCreditCardMutation();
  const [editCardName, setEditCardName] = useState(
    currentEntry ? currentEntry.cardName : ""
  );
  const [editCardholderName, setEditCardholderName] = useState(
    currentEntry ? currentEntry.cardholderName : ""
  );
  const [editNumber, setEditNumber] = useState(
    currentEntry ? currentEntry.number : ""
  );
  const [editExpiration, setEditExpiration] = useState(
    currentEntry ? currentEntry.expiration : ""
  );
  const [editCsv, setEditCsv] = useState(currentEntry ? currentEntry.csv : "");

  useEffect(() => {
    setEditCardName(currentEntry ? currentEntry.cardName : "");
    setEditCardholderName(currentEntry ? currentEntry.cardholderName : "");
    setEditNumber(currentEntry ? currentEntry.number : "");
    setEditExpiration(currentEntry ? currentEntry.expiration : "");
    setEditCsv(currentEntry ? currentEntry.csv : "");
  }, [currentEntry]);

  const handleEdit = async () => {
    const id = currentEntry.creditcardID;
    const updatedCreditCardData = {
      folderID: currentEntry.folderID,
      cardName: encryptText(editCardName, loggedInUser.masterKey),
      cardholderName: encryptText(editCardholderName, loggedInUser.masterKey),
      number: encryptText(editNumber, loggedInUser.masterKey),
      expiration: encryptText(editExpiration, loggedInUser.masterKey),
      csv: encryptText(editCsv, loggedInUser.masterKey),
    };

    try {
      await updateCreditCard({
        creditCardID: id,
        updatedData: updatedCreditCardData,
      });
      dispatch(
        setSnackbar({
          message: "Credit Card updated successfully",
          severity: "success",
        })
      );
      setIsEditing(false);
      creditcardRefetch();
      dispatch(
        setCurrentEntry({
          ...currentEntry,
          cardName: editCardName,
          cardholderName: editCardholderName,
          number: editNumber,
          expiration: editExpiration,
          csv: editCsv,
        })
      );
    } catch (error) {
      console.error("Error updating credit card", error);
      dispatch(
        setSnackbar({
          message: "An unexpected error occurred. Please try again.",
          severity: "error",
        })
      );
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "80%",
          marginTop: "1rem",
        }}
      >
        <EntryDetailTextField
          label="Card Name"
          entry={currentEntry ? currentEntry.cardName : ""}
          isEditing={isEditing}
          isSecret={false}
          editValue={editCardName}
          setEditValue={setEditCardName}
        />
        <EntryDetailTextField
          label="Card Holder Name"
          entry={currentEntry ? currentEntry.cardholderName : ""}
          isEditing={isEditing}
          isSecret={false}
          editValue={editCardholderName}
          setEditValue={setEditCardholderName}
        />
        <EntryDetailTextField
          label="Card Number"
          entry={currentEntry ? currentEntry.number : ""}
          isEditing={isEditing}
          isSecret={true}
          editValue={editNumber}
          setEditValue={setEditNumber}
        />
        <EntryDetailTextField
          label="Expiration Date"
          entry={currentEntry ? currentEntry.expiration : ""}
          isEditing={isEditing}
          isSecret={true}
          editValue={editExpiration}
          setEditValue={setEditExpiration}
        />
        <EntryDetailTextField
          label="CSV"
          entry={currentEntry ? currentEntry.csv : ""}
          isEditing={isEditing}
          isSecret={true}
          editValue={editCsv}
          setEditValue={setEditCsv}
        />
      </Box>
      {isEditing && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Button variant="contained" onClick={handleEdit}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </>
  );
}
