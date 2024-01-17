import CryptoJS from "crypto-js";
import aesjs from "aes-js";
import sha256 from "js-sha256";

export const deriveKey = (password, salt) => {
  const wordArray = CryptoJS.PBKDF2(password, salt, {
    keySize: 256,
    iterations: 1000,
  });

  return wordArray.toString(CryptoJS.enc.Hex);
};

export const encryptText = (text, password) => {
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const passwordHash = sha256(password);
  const passwordBytes = aesjs.utils.hex.toBytes(passwordHash);
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    passwordBytes,
    new aesjs.Counter(5)
  );
  const encryptedBytes = aesCtr.encrypt(textBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
};

export const decryptText = (ciphertext, password) => {
  const encryptedBytes = aesjs.utils.hex.toBytes(ciphertext);
  const passwordHash = sha256(password);
  const passwordBytes = aesjs.utils.hex.toBytes(passwordHash);
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    passwordBytes,
    new aesjs.Counter(5)
  );
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
};
