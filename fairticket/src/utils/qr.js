/**
 * Generates a 15×15 grid of 0/1 cells that visually resembles a QR code.
 * This is a deterministic hash-based simulation — not a real scannable QR.
 * For production, swap this with a library like `qrcode` or `react-qr-code`.
 *
 * @param {string} value  – ticket ID or any unique string
 * @returns {number[]}    – flat array of 225 values (0 or 1)
 */
export function generateQRCells(value) {
  // Simple but deterministic hash
  const hash = value
    .split('')
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0)

  const cells = Array.from(
    { length: 225 },
    (_, i) => ((hash * (i + 7) * 1103515245 + 12345) >>> 4) & 1,
  )

  // Stamp standard 7×7 finder patterns (top-left, top-right, bottom-left)
  const finderOffsets = [
    // top-left
    ...[0,1,2,3,4,5,6].flatMap(r => [0,1,2,3,4,5,6].map(c => [r,c])),
    // top-right
    ...[0,1,2,3,4,5,6].flatMap(r => [8,9,10,11,12,13,14].map(c => [r,c])),
    // bottom-left
    ...[8,9,10,11,12,13,14].flatMap(r => [0,1,2,3,4,5,6].map(c => [r,c])),
  ]
  finderOffsets.forEach(([r, c]) => {
    // Outer ring on, inner hollow, centre on
    const onEdge = r === 0 || r === 6 || c === 0 || c === 6 ||
                   r === 8 || r === 14 || c === 8 || c === 14
    const centre = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
                   (r >= 2 && r <= 4 && c >= 10 && c <= 12) ||
                   (r >= 10 && r <= 12 && c >= 2 && c <= 4)
    cells[r * 15 + c] = onEdge || centre ? 1 : 0
  })

  return cells
}

export const QR_SIZE = 15
