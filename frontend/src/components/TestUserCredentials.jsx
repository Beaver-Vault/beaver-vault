import { Button, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function TestUserCredentials() {
  const [showCredentials, setShowCredentials] = useState(false);
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => {
            setShowCredentials(!showCredentials);
          }}
        >
          {showCredentials ? "Hide" : "Show"} Test User Credentials
        </Button>
        {showCredentials && (
          <>
            <Typography variant="body2">Username: Test@gmail.com</Typography>
            <Typography variant="body2">Password: Testing123</Typography>
          </>
        )}
      </Box>
    </>
  );
}
