import CryptoJS from "crypto-js";
import aesjs from "aes-js";
import sha256 from "js-sha256";

/**
 * Derives a 256-bit key from a password and salt using PBKDF2
 *
 * @param {string} password - User's password
 * @param {string} salt - User's email address
 * @returns {string} - 256-bit key as a hexadecimal string
 */
export const deriveKey = (password, salt) => {
  // Derive a 256-bit key from the password and salt using PBKDF2
  const wordArray = CryptoJS.PBKDF2(password, salt, {
    keySize: 256,
    iterations: 1000,
  });

  return wordArray.toString(CryptoJS.enc.Hex);
};

/**
 * This function takes in a string and a password and returns an encrypted string using the password as a cipher
 *
 * @param {string} text - plaintext that needs to be encrypted
 * @param {string} password - cipher to encrypt the plaintext
 * @returns {string} - The encrypted text as a hexadecimal string
 */
export const encryptText = (text, key) => {
  // Convert the text to byte array
  const textBytes = aesjs.utils.utf8.toBytes(text);

  // hash the password to get a 32-byte key
  // key needs to be generated in 16-byte increments
  const keyHash = sha256(key);
  const keyBytes = aesjs.utils.hex.toBytes(keyHash);

  // create a new AES CTR mode of operation with the password bytes and a new counter starting at 5
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));

  // encrypt the text
  const encryptedBytes = aesCtr.encrypt(textBytes);

  // convert the encrypted bytes to a hexadecimal string
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

  return encryptedHex;
};

/**
 * This function takes in an encrypted string and a password and returns a decrypted string using the password as a cipher
 *
 * @param {string} ciphertext - encrypted text that needs to be decrypted
 * @param {string} key - cipher to decrypt the ciphertext
 * @returns {string} - The decrypted text as a string
 */
export const decryptText = (ciphertext, key) => {
  // convert the ciphertext to a byte array
  const encryptedBytes = aesjs.utils.hex.toBytes(ciphertext);

  // hash the password to get a 32-byte key
  const keyHash = sha256(key);
  const keyBytes = aesjs.utils.hex.toBytes(keyHash);

  // create a new AES CTR mode of operation with the password bytes and a new counter starting at 5
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));

  // decrypt the text
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  return decryptedText;
};
