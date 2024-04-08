import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "../scripts/storage";
import { fakePasswords } from "../scripts/fakedata"; // Import fake passwords

export default function CacheTestPage() {
  const [cacheKey] = useState("apiResponse"); // Key used for caching
  const [cachedData, setCachedData] = useState(""); // State for cached data
  const [freshData, setFreshData] = useState(""); // State for fresh/fetched data

  const simulateFetchData = () => {
    const dataFromCache = loadFromLocalStorage(cacheKey);
    if (dataFromCache) {
      // Data is found in cache
      setCachedData(JSON.stringify(dataFromCache, null, 2));
      setFreshData(""); // Clear fresh data field
    } else {
      // No data in cache, simulate fetching fresh data
      saveToLocalStorage(cacheKey, fakePasswords);
      setFreshData(JSON.stringify(fakePasswords, null, 2));
      setCachedData(""); // Clear cached data field
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem(cacheKey);
    setCachedData("");
    setFreshData("");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          margin: "auto",
          width: "80%",
          padding: "1rem",
        }}
      >
        <Button variant="contained" fullWidth onClick={simulateFetchData}>
          Simulate API Fetch and Cache
        </Button>

        {/* Display Fresh/Fetched Data */}
        {freshData && (
          <TextField
            label="Fresh Data (Simulated Fetch)"
            helperText="This data simulates a fresh API response."
            fullWidth
            multiline
            value={freshData}
            InputProps={{
              readOnly: true,
            }}
            FormHelperTextProps={{
              style: { fontSize: "1.2rem", color: "green" }, // Increase the font size of the helperText
            }}
          />
        )}

        {/* Display Cached Data */}
        {cachedData && (
          <TextField
            label="Cached Data"
            helperText="This data was retrieved from the cache."
            fullWidth
            multiline
            value={cachedData}
            InputProps={{
              readOnly: true,
            }}
            FormHelperTextProps={{
              style: { fontSize: "1.2rem", color: "green" }, // Increase the font size of the helperText
            }}
          />
        )}

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleClearCache}
        >
          Clear Cache
        </Button>
      </Box>
    </>
  );
}
