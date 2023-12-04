import aesjs from 'aes-js';
import sha256 from 'js-sha256';

/**
 * This function takes in a string and a password and returns an encrypted string using the password as a cipher
 * @param {string} text - plaintext that needs to be encrypted
 * @param {string} password - cipher to encrypt the plaintext
 * @returns {string} Description of the return value
 */
export const encryptText = (text, password) => {
  // Convert the text to byte array
  const textBytes = aesjs.utils.utf8.toBytes(text);
  
  // hash the password to get a 32-byte key
  // key needs to be generated in 16-byte increments
  const passwordHash = sha256(password);
  const passwordBytes = aesjs.utils.hex.toBytes(passwordHash);  
  
  // create a new AES CTR mode of operation with the password bytes and a new counter starting at 5
  const aesCtr = new aesjs.ModeOfOperation.ctr(passwordBytes, new aesjs.Counter(5));

  // encrypt the text
  const encryptedBytes = aesCtr.encrypt(textBytes);

  // convert the encrypted bytes to a hexadecimal string
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

  console.log("encryptedHex: ", encryptedHex);

  return encryptedHex;
}