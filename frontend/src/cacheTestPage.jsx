import React from 'react';
import { useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import CryptoJS from 'crypto-js';

const queryClient = new QueryClient();

const encryptData = (data) => {
    const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return `${iv.toString(CryptoJS.enc.Hex)}${encrypted.toString()}`;
};

const decryptData = (ivAndEncryptedData) => {
    if (!ivAndEncryptedData) return null;
    const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Hex.parse(ivAndEncryptedData.substr(0, 32));
    const encryptedData = ivAndEncryptedData.substring(32);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedData ? JSON.parse(decryptedData) : null;
};


const fetchUserData = async (userId) => {
    if (!userId) return null;
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`);
        if (!response.ok) {
            console.error('Failed to fetch:', response.status, response.statusText);
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log('Data fetched:', data);  // Check what is actually fetched
        return encryptData(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

const CacheTestPage = () => {
    const loggedInUser = useSelector(state => state.auth.user);
    const userId = loggedInUser ? loggedInUser.userID : null;

    const { data: encryptedData, error, isLoading } = useQuery(
        'userData',
        () => fetchUserData(userId),
        {
            enabled: !!userId,
            select: decryptData
        }
    );

    if (isLoading) return <div>Loading user data...</div>;
    if (error) return <div>Error loading user data: {error.message}</div>;
    if (!encryptedData) return <div>No user data found or decryption failed</div>;


    return (
        <div>
            <h1>User Data Page</h1>
            <div>User ID: {userId}</div>
        </div>
    );
};

const CacheTestPageWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CacheTestPage />
        </QueryClientProvider>
    );
};

export default CacheTestPageWrapper;
