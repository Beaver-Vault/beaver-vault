import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalPage({ modalOpen, setModalOpen, ModalForm }) {
  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          console.log("Modal closed");
          setModalOpen(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            // p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              onClick={() => {
                setModalOpen(false);
              }}
            >
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 3,
            }}
          >
            <ModalForm />
          </Box>
        </Box>
      </Modal>
    </>
  );
}
