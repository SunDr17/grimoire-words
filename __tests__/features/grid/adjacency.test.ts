import {
  getAdjacentPositions,
  areAdjacent,
  positionToIndex,
  indexToPosition,
  positionKey,
} from '@/features/grid/utils/adjacency'

describe('adjacency', () => {
  describe('getAdjacentPositions', () => {
    it('returns 8 neighbors for center cell on 4x4', () => {
      const adj = getAdjacentPositions({ row: 1, col: 1 }, 4)
      expect(adj).toHaveLength(8)
    })

    it('returns 3 neighbors for corner cell on 4x4', () => {
      const adj = getAdjacentPositions({ row: 0, col: 0 }, 4)
      expect(adj).toHaveLength(3)
      expect(adj).toContainEqual({ row: 0, col: 1 })
      expect(adj).toContainEqual({ row: 1, col: 0 })
      expect(adj).toContainEqual({ row: 1, col: 1 })
    })

    it('returns 5 neighbors for edge cell on 5x5', () => {
      const adj = getAdjacentPositions({ row: 0, col: 2 }, 5)
      expect(adj).toHaveLength(5)
    })

    it('works for 7x7 grid center', () => {
      const adj = getAdjacentPositions({ row: 3, col: 3 }, 7)
      expect(adj).toHaveLength(8)
    })

    it('works for 7x7 grid bottom-right corner', () => {
      const adj = getAdjacentPositions({ row: 6, col: 6 }, 7)
      expect(adj).toHaveLength(3)
    })
  })

  describe('areAdjacent', () => {
    it('returns true for horizontally adjacent', () => {
      expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(true)
    })

    it('returns true for vertically adjacent', () => {
      expect(areAdjacent({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(true)
    })

    it('returns true for diagonally adjacent', () => {
      expect(areAdjacent({ row: 0, col: 0 }, { row: 1, col: 1 })).toBe(true)
    })

    it('returns false for same position', () => {
      expect(areAdjacent({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(false)
    })

    it('returns false for non-adjacent', () => {
      expect(areAdjacent({ row: 0, col: 0 }, { row: 2, col: 2 })).toBe(false)
    })
  })

  describe('positionToIndex / indexToPosition', () => {
    it('converts position to index correctly for 4x4', () => {
      expect(positionToIndex({ row: 0, col: 0 }, 4)).toBe(0)
      expect(positionToIndex({ row: 1, col: 2 }, 4)).toBe(6)
      expect(positionToIndex({ row: 3, col: 3 }, 4)).toBe(15)
    })

    it('converts index to position correctly for 4x4', () => {
      expect(indexToPosition(0, 4)).toEqual({ row: 0, col: 0 })
      expect(indexToPosition(6, 4)).toEqual({ row: 1, col: 2 })
      expect(indexToPosition(15, 4)).toEqual({ row: 3, col: 3 })
    })

    it('round-trips correctly for 7x7', () => {
      for (let i = 0; i < 49; i++) {
        const pos = indexToPosition(i, 7)
        expect(positionToIndex(pos, 7)).toBe(i)
      }
    })
  })

  describe('positionKey', () => {
    it('generates unique keys', () => {
      expect(positionKey({ row: 0, col: 1 })).toBe('0,1')
      expect(positionKey({ row: 3, col: 4 })).toBe('3,4')
    })
  })
})
