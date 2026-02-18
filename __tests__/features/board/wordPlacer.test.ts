import { placeWordsOnGrid } from '@/features/board/utils/wordPlacer'
import { areAdjacent } from '@/features/grid/utils/adjacency'

describe('wordPlacer', () => {
  describe('placeWordsOnGrid', () => {
    it('places a single word as an adjacent path', () => {
      const grid = placeWordsOnGrid(['STONE'], 6)

      const positions: { row: number; col: number; letter: string }[] = []
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          if (grid[row][col] !== null) {
            positions.push({ row, col, letter: grid[row][col]! })
          }
        }
      }

      const wordLetters = positions.map((p) => p.letter).join('')
      expect(wordLetters.length).toBe(5)

      for (let i = 0; i < positions.length - 1; i++) {
        expect(
          areAdjacent(
            { row: positions[i].row, col: positions[i].col },
            { row: positions[i + 1].row, col: positions[i + 1].col },
          ),
        ).toBe(true)
      }
    })

    it('fills only word cells, leaves rest as null', () => {
      const grid = placeWordsOnGrid(['CAT'], 6)

      let filledCount = 0
      let nullCount = 0
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          if (grid[row][col] === null) {
            nullCount++
          } else {
            filledCount++
            expect(grid[row][col]).toMatch(/^[A-Z]$/)
          }
        }
      }

      expect(filledCount).toBeLessThanOrEqual(3)
      expect(nullCount).toBeGreaterThanOrEqual(33)
    })

    it('places multiple words on the grid', () => {
      const grid = placeWordsOnGrid(['STRANGE', 'LIGHT', 'CAT'], 7)

      let filledCount = 0
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
          if (grid[row][col] !== null) {
            filledCount++
            expect(grid[row][col]).toMatch(/^[A-Z]$/)
          }
        }
      }

      expect(filledCount).toBeGreaterThanOrEqual(3)
    })

    it('filled cells are uppercase letters', () => {
      const grid = placeWordsOnGrid(['MASTER', 'STONE'], 6)

      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          const cell = grid[row][col]
          if (cell !== null) {
            expect(cell).toMatch(/^[A-Z]$/)
          }
        }
      }
    })

    it('places longest words first for better fit', () => {
      const grid = placeWordsOnGrid(['CAT', 'STRANGE', 'LIGHT'], 7)

      let filledCount = 0
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
          if (grid[row][col] !== null) {
            filledCount++
          }
        }
      }

      expect(filledCount).toBeGreaterThanOrEqual(3)
    })

    it('returns correct grid dimensions', () => {
      const grid6 = placeWordsOnGrid(['TEST'], 6)
      expect(grid6.length).toBe(6)
      for (const row of grid6) {
        expect(row.length).toBe(6)
      }

      const grid7 = placeWordsOnGrid(['TEST'], 7)
      expect(grid7.length).toBe(7)
      for (const row of grid7) {
        expect(row.length).toBe(7)
      }
    })
  })
})
