import { useMemo } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import type { GridPosition } from '@/shared/types'
import type { CellLayout } from './useCellPositions'

interface UseGridGestureProps {
  readonly positions: Map<string, CellLayout>
  readonly gridSize: number
  readonly gridOffsetY: number
  readonly onCellHit: (position: GridPosition) => void
  readonly onSwipeEnd: () => void
  readonly onSubmit: () => void
  readonly enabled: boolean
}

function findCell(
  x: number,
  y: number,
  positions: Map<string, CellLayout>,
  gridSize: number,
): GridPosition | null {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const layout = positions.get(`${row},${col}`)
      if (!layout) continue

      const padding = 4
      if (
        x >= layout.x - padding &&
        x <= layout.x + layout.size + padding &&
        y >= layout.y - padding &&
        y <= layout.y + layout.size + padding
      ) {
        return { row, col }
      }
    }
  }
  return null
}

export function useGridGesture({
  positions,
  gridSize,
  gridOffsetY,
  onCellHit,
  onSwipeEnd,
  onSubmit,
  enabled,
}: UseGridGestureProps) {
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .enabled(enabled)
        .minDistance(0)
        .onStart((event) => {
          const pos = findCell(event.x, event.y - gridOffsetY, positions, gridSize)
          if (pos) {
            onCellHit(pos)
          }
        })
        .onUpdate((event) => {
          const pos = findCell(event.x, event.y - gridOffsetY, positions, gridSize)
          if (pos) {
            onCellHit(pos)
          }
        })
        .onEnd(() => {
          onSwipeEnd()
          onSubmit()
        }),
    [positions, gridSize, gridOffsetY, onCellHit, onSwipeEnd, onSubmit, enabled],
  )

  return gesture
}
