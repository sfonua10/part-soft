//REMOVE in February 2024 if not needed
import { UniqueCodeState } from '@/models/workOrder'

const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export async function generateUniqueCode() {
  let state = await UniqueCodeState.findOne({})
  if (!state) {
    state = new UniqueCodeState()
    await state.save()
  }

  if (state.currentIndex >= allowedChars.length) {
    state.currentIndex = 0
  }

  const code = allowedChars.charAt(state.currentIndex)
  state.currentIndex++
  await state.save()
  return code
}
