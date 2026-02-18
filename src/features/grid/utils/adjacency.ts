import type { GridPosition } from '@/shared/types'

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const

export function getAdjacentPositions(
  position: GridPosition,
  gridSize: number,
): readonly GridPosition[] {
  return DIRECTIONS
    .map(([dr, dc]) => ({
      row: position.row + dr,
      col: position.col + dc,
    }))
    .filter(
      (pos) =>
        pos.row >= 0 &&
        pos.row < gridSize &&
        pos.col >= 0 &&
        pos.col < gridSize,
    )
}

export function areAdjacent(a: GridPosition, b: GridPosition): boolean {
  const rowDiff = Math.abs(a.row - b.row)
  const colDiff = Math.abs(a.col - b.col)
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)
}

export function positionToIndex(pos: GridPosition, gridSize: number): number {
  return pos.row * gridSize + pos.col
}

export function indexToPosition(index: number, gridSize: number): GridPosition {
  return {
    row: Math.floor(index / gridSize),
    col: index % gridSize,
  }
}

export function positionKey(pos: GridPosition): string {
  return `${pos.row},${pos.col}`
}
