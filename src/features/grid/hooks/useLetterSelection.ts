import { useCallback, useRef } from 'react'
import type { GridPosition } from '@/shared/types'
import { areAdjacent, positionKey } from '@/features/grid/utils/adjacency'

interface UseLetterSelectionProps {
  readonly onSelect: (position: GridPosition) => void
  readonly onDeselect: () => void
  readonly onClear: () => void
  readonly selectedCells: readonly GridPosition[]
  readonly decayedCells: ReadonlySet<string>
  readonly hiddenCells: ReadonlySet<string>
}

export function useLetterSelection({
  onSelect,
  onDeselect,
  onClear,
  selectedCells,
  decayedCells,
  hiddenCells,
}: UseLetterSelectionProps) {
  const lastProcessed = useRef<string | null>(null)
  const selectedRef = useRef(selectedCells)
  selectedRef.current = selectedCells
  const decayedRef = useRef(decayedCells)
  decayedRef.current = decayedCells
  const hiddenRef = useRef(hiddenCells)
  hiddenRef.current = hiddenCells

  const handleCellHit = useCallback(
    (position: GridPosition) => {
      const key = positionKey(position)

      if (key === lastProcessed.current) return
      lastProcessed.current = key

      if (decayedRef.current.has(key) || hiddenRef.current.has(key)) return

      const cells = selectedRef.current
      const existingIndex = cells.findIndex(
        (c) => c.row === position.row && c.col === position.col,
      )

      if (existingIndex >= 0) {
        if (existingIndex === cells.length - 2) {
          onDeselect()
        }
        return
      }

      if (cells.length > 0) {
        const last = cells[cells.length - 1]
        if (!areAdjacent(last, position)) return
      }

      onSelect(position)
    },
    [onSelect, onDeselect],
  )

  const handleSwipeEnd = useCallback(() => {
    lastProcessed.current = null
  }, [])

  const resetSelection = useCallback(() => {
    lastProcessed.current = null
    onClear()
  }, [onClear])

  return { handleCellHit, handleSwipeEnd, resetSelection }
}
