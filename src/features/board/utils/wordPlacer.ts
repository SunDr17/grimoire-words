import type { GridPosition } from '@/shared/types'
import { getAdjacentPositions, positionKey } from '@/features/grid/utils/adjacency'
import { shuffleArray } from './seedWords'

type MutableGrid = (string | null)[][]

export function placeWordsOnGrid(
  words: readonly string[],
  gridSize: number,
): MutableGrid {
  const grid: MutableGrid = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => null),
  )

  const sorted = [...words].sort((a, b) => b.length - a.length)

  for (const word of sorted) {
    tryPlaceWord(grid, gridSize, word)
  }

  return grid
}

function tryPlaceWord(
  grid: MutableGrid,
  gridSize: number,
  word: string,
): boolean {
  const upperWord = word.toUpperCase()
  const allPositions: GridPosition[] = []

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      allPositions.push({ row, col })
    }
  }

  const shuffledPositions = shuffleArray(allPositions) as GridPosition[]
  const maxStarts = Math.min(shuffledPositions.length, gridSize * 3)

  for (let i = 0; i < maxStarts; i++) {
    const start = shuffledPositions[i]
    const cell = grid[start.row][start.col]

    if (cell !== null && cell !== upperWord[0]) {
      continue
    }

    const path = findWordPath(
      grid,
      gridSize,
      upperWord,
      0,
      start,
      new Set<string>(),
      [],
    )

    if (path.length === upperWord.length) {
      for (let ci = 0; ci < path.length; ci++) {
        const pos = path[ci]
        grid[pos.row][pos.col] = upperWord[ci]
      }
      return true
    }
  }

  return false
}

function findWordPath(
  grid: MutableGrid,
  gridSize: number,
  word: string,
  charIndex: number,
  pos: GridPosition,
  visited: Set<string>,
  path: readonly GridPosition[],
): readonly GridPosition[] {
  const cell = grid[pos.row][pos.col]
  if (cell !== null && cell !== word[charIndex]) {
    return []
  }

  const key = positionKey(pos)
  if (visited.has(key)) {
    return []
  }

  const newPath = [...path, pos]

  if (charIndex === word.length - 1) {
    return newPath
  }

  const newVisited = new Set(visited)
  newVisited.add(key)

  const neighbors = getAdjacentPositions(pos, gridSize)
  const shuffledNeighbors = shuffleArray(neighbors) as GridPosition[]

  for (const neighbor of shuffledNeighbors) {
    const result = findWordPath(
      grid,
      gridSize,
      word,
      charIndex + 1,
      neighbor,
      newVisited,
      newPath,
    )

    if (result.length === word.length) {
      return result
    }
  }

  return []
}
