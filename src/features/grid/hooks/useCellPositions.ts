import { useMemo } from 'react'
import { calculateCellSize, LAYOUT } from '@/shared/constants'
import type { GridPosition } from '@/shared/types'

export interface CellLayout {
  readonly x: number
  readonly y: number
  readonly centerX: number
  readonly centerY: number
  readonly size: number
}

export function useCellPositions(gridSize: number) {
  return useMemo(() => {
    const cellSize = calculateCellSize(gridSize)
    const gridWidth = gridSize * cellSize + (gridSize - 1) * LAYOUT.gridGap
    const padOffset = LAYOUT.gridPadding / 2

    const positions = new Map<string, CellLayout>()

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = padOffset + col * (cellSize + LAYOUT.gridGap)
        const y = padOffset + row * (cellSize + 16 + LAYOUT.gridGap)
        positions.set(`${row},${col}`, {
          x,
          y,
          centerX: x + cellSize / 2,
          centerY: y + cellSize / 2,
          size: cellSize,
        })
      }
    }

    return { positions, cellSize, gridWidth }
  }, [gridSize])
}

export function hitTestCell(
  touchX: number,
  touchY: number,
  positions: Map<string, CellLayout>,
  gridSize: number,
): GridPosition | null {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const layout = positions.get(`${row},${col}`)
      if (!layout) continue

      if (
        touchX >= layout.x &&
        touchX <= layout.x + layout.size &&
        touchY >= layout.y &&
        touchY <= layout.y + layout.size
      ) {
        return { row, col }
      }
    }
  }
  return null
}
