import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState, useEffect } from "react";

export default function EntryDetailTextField({
  label,
  entry,
  isEditing,
  isSecret,
  rows = 1,
  editValue,
  setEditValue,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [entry]);

  return (
    <TextField
      label={label}
      value={isEditing ? editValue : entry}
      fullWidth
      type={isSecret ? (visible ? "text" : "password") : "text"}
      disabled={!isEditing}
      multiline={rows > 1}
      rows={rows}
      onChange={(e) => setEditValue(e.target.value)}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            {isSecret && (
              <IconButton onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(entry);
                alert("Copied to clipboard");
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
