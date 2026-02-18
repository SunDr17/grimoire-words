import { useCallback } from 'react'
import type { MonsterType, GridSize, GridPosition } from '@/shared/types'
import type { GameAction } from '@/features/game/state/gameTypes'
import { useLetterFlip } from './useLetterFlip'
import { useLetterDecay } from './useLetterDecay'
import { useDoomClock } from './useDoomClock'

interface UseDarkLevelEffectsProps {
  readonly monster: MonsterType | undefined
  readonly gridSize: GridSize
  readonly decayedCells: ReadonlySet<string>
  readonly dispatch: (action: GameAction) => void
  readonly isPlaying: boolean
}

export function useDarkLevelEffects({
  monster,
  gridSize,
  decayedCells,
  dispatch,
  isPlaying,
}: UseDarkLevelEffectsProps) {
  const handleHide = useCallback(
    (position: GridPosition) => {
      dispatch({ type: 'HIDE_CELL', position })
    },
    [dispatch],
  )

  const handleReveal = useCallback(
    (position: GridPosition) => {
      dispatch({ type: 'REVEAL_CELL', position })
    },
    [dispatch],
  )

  const handleDecay = useCallback(
    (position: GridPosition) => {
      dispatch({ type: 'DECAY_CELL', position })
    },
    [dispatch],
  )

  const handleDoomTick = useCallback(
    (timeLost: number) => {
      dispatch({ type: 'DOOM_TICK', timeLost })
    },
    [dispatch],
  )

  const hasFlip = monster === 'gloomfang' || monster === 'blightworm' || monster === 'unwriter'
  const hasDecay = monster === 'blightworm' || monster === 'unwriter'
  const hasDoom = monster === 'unwriter'

  const maxDecay = Math.floor(gridSize * gridSize * 0.25)

  useLetterFlip({
    enabled: hasFlip && isPlaying,
    gridSize,
    onHide: handleHide,
    onReveal: handleReveal,
    decayedCells,
  })

  useLetterDecay({
    enabled: hasDecay && isPlaying,
    gridSize,
    onDecay: handleDecay,
    decayedCells,
    maxDecay,
  })

  useDoomClock({
    enabled: hasDoom && isPlaying,
    onTimeLost: handleDoomTick,
  })
}
