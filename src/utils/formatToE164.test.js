import { formatToE164 } from './formatToE164'

describe('formatToE164', () => {
  it('formats standard US number without country code', () => {
    expect(formatToE164('8017229592')).toBe('+18017229592')
  })

  it('keeps standard US number with country code unchanged', () => {
    expect(formatToE164('+18017229592')).toBe('+18017229592')
  })

  it('formats number starting with + but without country code', () => {
    expect(formatToE164('+8017229592')).toBe('+18017229592')
  })
})
