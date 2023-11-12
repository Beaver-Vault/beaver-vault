import {
  Button,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PasswordCell({ password }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <OutlinedInput
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
      }}
      fullWidth
      type={showPassword ? "text" : "password"}
      readOnly
      value={password}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
