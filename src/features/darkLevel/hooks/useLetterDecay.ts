import { useEffect, useRef } from 'react'
import type { GridPosition, GridSize } from '@/shared/types'

interface UseLetterDecayProps {
  readonly enabled: boolean
  readonly gridSize: GridSize
  readonly onDecay: (position: GridPosition) => void
  readonly decayedCells: ReadonlySet<string>
  readonly maxDecay: number
}

export function useLetterDecay({
  enabled,
  gridSize,
  onDecay,
  decayedCells,
  maxDecay,
}: UseLetterDecayProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const decayedRef = useRef<ReadonlySet<string>>(decayedCells)

  decayedRef.current = decayedCells

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(() => {
      if (decayedRef.current.size >= maxDecay) return

      const available: GridPosition[] = []

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!decayedRef.current.has(`${row},${col}`)) {
            available.push({ row, col })
          }
        }
      }

      if (available.length > 0) {
        const target = available[Math.floor(Math.random() * available.length)]
        onDecay(target)
      }
    }, 8000 + Math.random() * 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, gridSize, onDecay, maxDecay])
}
