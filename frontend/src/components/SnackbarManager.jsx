import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { closeSnackbar } from "../slices/snackbarSlice";

export default function SnackbarManager() {
  const dispatch = useDispatch();

  const { open, message, severity } = useSelector((state) => state.snackbar);
  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        autoHideDuration={10000}
        onClose={() => {
          dispatch(closeSnackbar());
        }}
      >
        <Alert
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => {
            dispatch(closeSnackbar());
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
