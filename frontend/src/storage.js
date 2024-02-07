// Function to save data to localStorage
export const saveToLocalStorage = (key, data) => {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (err) {
        // Handle JSON stringify error or localStorage issues
        console.error("Error saving to localStorage", err);
    }
};

// Function to load data from localStorage
export const loadFromLocalStorage = (key) => {
    try {
        const serializedData = localStorage.getItem(key);
        return serializedData ? JSON.parse(serializedData) : null;
    } catch (err) {
        // Handle JSON parse error or localStorage issues
        console.error("Error loading from localStorage", err);
        return null;
    }
};

// Function to remove data from localStorage
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (err) {
        // Handle localStorage issues
        console.error("Error removing item from localStorage", err);
    }
};

// Function to clear all data from localStorage
export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (err) {
        // Handle localStorage issues
        console.error("Error clearing localStorage", err);
    }
};
