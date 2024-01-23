import CryptoJS from "crypto-js";
import aesjs from "aes-js";

/**
 * Generates a random salt of a specified length
 *
 * @param {number} length - The length of the salt in bytes
 * @returns {string} - The generated salt as a hexadecimal string
 */
export const generateSalt = (length = 16) => {
  return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
};

/**
 * Derives a 512-bit key from a password and salt using PBKDF2
 *
 * @param {string} password - User's password
 * @param {string} salt - Randomly generated salt
 * @returns {string} - 512-bit key as a hexadecimal string
 */
export const deriveKey = (password, salt) => {
  // Derive a 512-bit key from the password and salt using PBKDF2 with 10,000 iterations
  const wordArray = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 512 / 32, // 512 bits / 32 bits per word = 16 words
    iterations: 10000,
  });

  return wordArray.toString(CryptoJS.enc.Hex);
};

/**
 * This function takes in a string and a key, encrypts the string using the first half of the key,
 * and returns an encrypted string prepended with the IV as a hexadecimal string.
 *
 * @param {string} text - Plaintext to be encrypted
 * @param {string} key - 512-bit Key for encryption
 * @returns {string} - IV + encrypted text as a hexadecimal string
 */
export const encryptText = (text, key) => {
  // Use the first 256 bits of the 512-bit key
  const keyBytes = aesjs.utils.hex.toBytes(key.substring(0, 64));

  // Convert the text to a byte array
  const textBytes = aesjs.utils.utf8.toBytes(text);

  // Generate a random 16-byte IV/counter
  const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  const ivBytes = aesjs.utils.hex.toBytes(iv);

  // Create a new AES CTR mode of operation with the key bytes and the IV/counter
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(ivBytes));

  // Encrypt the text
  const encryptedBytes = aesCtr.encrypt(textBytes);

  // Convert the encrypted bytes to a hexadecimal string and prepend the IV
  const encryptedHex = iv + aesjs.utils.hex.fromBytes(encryptedBytes);

  return encryptedHex;
};

/**
 * This function takes in an encrypted string and a key, and returns the decrypted string.
 *
 * @param {string} ciphertext - Encrypted text (including IV) that needs to be decrypted
 * @param {string} key - 512-bit Key for decryption
 * @returns {string} - The decrypted text
 */
export const decryptText = (ciphertext, key) => {
  // Use the first 256 bits of the 512-bit key
  const keyBytes = aesjs.utils.hex.toBytes(key.substring(0, 64));

  // Extract the IV (first 32 hex characters / 16 bytes)
  const iv = ciphertext.slice(0, 32);
  const ivBytes = aesjs.utils.hex.toBytes(iv);

  // Extract the encrypted text
  const encryptedBytes = aesjs.utils.hex.toBytes(ciphertext.slice(32));

  // Create a new AES CTR mode of operation with the key bytes and the IV/counter
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(ivBytes));

  // Decrypt the text
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedText;
};
