export async function loadWordList() {
  try {
    const response = await fetch('/words.txt'); // Fetching from the public directory
    const text = await response.text();
    return text.split('\n');
  } catch (error) {
    console.error('Failed to load word list:', error);
    return []; // Return an empty array if there's an error
  }
}

export const passwordGen = async (
  length,
  useUpper,
  useLower,
  useNumbers,
  useSymbols,
  usePassphrase
) => {
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (usePassphrase) {
    const wordList = await loadWordList();
    let passphrase = "";
    for (let i = 0; i < length; i++) {
      passphrase += wordList[Math.floor(Math.random() * wordList.length)].trim();
      if (i < length - 1) passphrase += "-";
    }
    return passphrase;
  }

  let allChars = "";
  if (useUpper) allChars += upperChars;
  if (useLower) allChars += lowerChars;
  if (useNumbers) allChars += numberChars;
  if (useSymbols) allChars += symbolChars;

  if (allChars === "") {
    return "Error: No character types selected. Please choose at least one character type.";
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    password += allChars[array[0] % allChars.length];
  }

  return password;
};
