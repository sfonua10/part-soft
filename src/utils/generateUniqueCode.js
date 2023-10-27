const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let currentIndex = 0;

export function generateUniqueCode() {
    if (currentIndex >= allowedChars.length) {
        currentIndex = 0;  // reset the index if it exceeds the length
    }
    const code = allowedChars.charAt(currentIndex);
    currentIndex++;
    return code;
}
