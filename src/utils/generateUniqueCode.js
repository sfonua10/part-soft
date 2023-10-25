const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let currentIndex = 0;

export function generateUniqueCode() {
  if (currentIndex >= allowedChars.length) {
    console.warn("All unique codes have been generated.");
    return null; // or handle this case differently if you like
  }

  const code = allowedChars.charAt(currentIndex);
  currentIndex++;
  return code;
}