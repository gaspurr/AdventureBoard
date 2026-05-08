// Encrypted ads come back with `adId`, `message` and `probability` all encoded.
// Encrypted flag values observed: 1 = base64, 2 = ROT13.

const decodeBase64 = (input: string): string => {
  try {
    return atob(input);
  } catch {
    return input;
  }
};

const decodeRot13 = (input: string): string =>
  input.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= "Z" ? 65 : 97;
    return String.fromCharCode(
      start + ((char.charCodeAt(0) - start + 13) % 26)
    );
  });

export const decodeMessage = (
  text: string,
  encrypted: number | null
): string => {
  if (encrypted === 1) return decodeBase64(text);
  if (encrypted === 2) return decodeRot13(text);
  return text;
};
