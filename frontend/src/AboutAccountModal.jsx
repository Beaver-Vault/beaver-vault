import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import BeaverLogo from "./imgs/BeaverVaultLogo_New.svg";
import Box from "@mui/material/Box";

const AboutAccountModelDialog = ({ open, handleClose }) => {
  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogContent>
        <img
          src={BeaverLogo}
          alt="Logo"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "25%",
          }}
        />
        <Box mt={2}>
          <Typography variant="h6" align="center" fontWeight="bold">
            Beaver Vault (Secure Password Manager)
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" align="center" fontWeight="bold">
            Developed by
          </Typography>
          <Typography variant="body2" align="center">
            John, Brandon, Kris
          </Typography>
          <Typography variant="body2" align="center">
            Oregon State University
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            This is a capstone project for Oregon State University's Computer
            Science program. Built using React, Node.js, and Python.
          </Typography>
          <Typography variant="body2" align="center">
            Version: 1.0
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutAccountModelDialog;
