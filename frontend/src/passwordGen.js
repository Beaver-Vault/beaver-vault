export const passwordGen = (
  length,
  useUpper,
  useLower,
  useNumbers,
  useSymbols
) => {
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let allChars = "";
  if (useUpper) allChars += upperChars;
  if (useLower) allChars += lowerChars;
  if (useNumbers) allChars += numberChars;
  if (useSymbols) allChars += symbolChars;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex =
      crypto.getRandomValues(new Uint32Array(1))[0] % allChars.length;
    password += allChars[randomIndex];
  }

  return password;
};

console.log(passwordGen(12, true, true, true, true)); // Generate a 12-character password with all character types
