export const formatToE164 = (phone) => {
  const numbersOnly = phone.replace(/\D/g, '') // Removes all non-numeric characters
  return numbersOnly.startsWith('1') ? `+${numbersOnly}` : `+1${numbersOnly}`
}
