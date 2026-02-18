import { useEffect, useRef } from 'react'
import type { GridPosition, GridSize } from '@/shared/types'

interface UseLetterFlipProps {
  readonly enabled: boolean
  readonly gridSize: GridSize
  readonly onHide: (position: GridPosition) => void
  readonly onReveal: (position: GridPosition) => void
  readonly decayedCells: ReadonlySet<string>
}

export function useLetterFlip({
  enabled,
  gridSize,
  onHide,
  onReveal,
  decayedCells,
}: UseLetterFlipProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRefs = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const decayedRef = useRef<ReadonlySet<string>>(decayedCells)

  decayedRef.current = decayedCells

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(() => {
      const row = Math.floor(Math.random() * gridSize)
      const col = Math.floor(Math.random() * gridSize)
      const key = `${row},${col}`

      if (decayedRef.current.has(key)) return

      const position = { row, col }
      onHide(position)

      const revealDelay = 2000 + Math.random() * 2000
      const timeoutId = setTimeout(() => {
        timeoutRefs.current.delete(timeoutId)
        onReveal(position)
      }, revealDelay)
      timeoutRefs.current.add(timeoutId)
    }, 3000 + Math.random() * 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      for (const id of timeoutRefs.current) {
        clearTimeout(id)
      }
      timeoutRefs.current.clear()
    }
  }, [enabled, gridSize, onHide, onReveal])
}
