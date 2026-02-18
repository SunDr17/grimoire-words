import { useReducer, useEffect, useCallback, useRef } from 'react'
import * as Haptics from 'expo-haptics'
import type { LevelConfig, GridPosition, Language, PowerUpType } from '@/shared/types'
import type { GameState, GameAction } from '@/features/game/state/gameTypes'
import { gameReducer, createInitialState } from '@/features/game/state/gameReducer'
import { isValidWord } from '@/features/words/utils/dictionary'
import { scoreWord } from '@/features/board/utils/boardSolver'
import {
  checkObjectiveComplete,
  checkBonusComplete,
  type GameStateForObjective,
} from '@/features/game/utils/objectives'
import { playSoundEffect } from '@/audio/utils/audioManager'

interface UseGameLoopProps {
  readonly levelConfig: LevelConfig
  readonly grid: readonly (readonly string[])[]
  readonly language: Language
  readonly inventoryCounts?: Record<PowerUpType, number>
}

function stateForObjective(state: GameState): GameStateForObjective {
  return {
    score: state.score,
    foundWords: state.foundWords,
    usedLetters: state.usedLetterPositions,
    timeRemaining: state.timeRemaining,
    powerUpsUsed: state.powerUpsUsed,
    totalLetters: state.gridSize * state.gridSize,
  }
}

export function useGameLoop({ levelConfig, grid, language, inventoryCounts }: UseGameLoopProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState(levelConfig, grid, language, inventoryCounts))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastWordScoreRef = useRef(0)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (state.status === 'playing') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK', delta: 1 })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [state.status])

  // Timer warning tick sound
  useEffect(() => {
    if (state.status === 'playing' && state.timeRemaining <= 10 && state.timeRemaining > 0) {
      playSoundEffect('tick')
    }
  }, [state.timeRemaining, state.status])

  // Win/lose sounds
  useEffect(() => {
    if (state.status === 'won') {
      playSoundEffect('complete')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else if (state.status === 'lost') {
      playSoundEffect('failed')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }, [state.status])

  useEffect(() => {
    if (state.status === 'playing') {
      const objState = stateForObjective(state)
      if (checkObjectiveComplete(objState, state.objective)) {
        dispatch({ type: 'WIN_GAME' })
      }
    }
  }, [state.score, state.foundWords.length, state.usedLetterPositions.size, state.status, state.objective])

  const handleStartGame = useCallback(() => {
    dispatch({ type: 'START_GAME' })
  }, [])

  const handleSelectCell = useCallback((position: GridPosition) => {
    dispatch({ type: 'SELECT_CELL', position })
    playSoundEffect('select')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [])

  const handleDeselectLast = useCallback(() => {
    dispatch({ type: 'DESELECT_LAST' })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [])

  const handleClearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }, [])

  const handleSubmitWord = useCallback(() => {
    const { currentWord, selectedCells } = stateRef.current

    if (currentWord.length < levelConfig.minWordLength) {
      dispatch({ type: 'REJECT_WORD' })
      return false
    }

    if (isValidWord(currentWord)) {
      const wordScore = scoreWord(currentWord, language)
      lastWordScoreRef.current = wordScore

      if (currentWord.length >= 6) {
        playSoundEffect('bonus')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      } else {
        playSoundEffect('valid')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }

      dispatch({
        type: 'SUBMIT_WORD',
        word: currentWord,
        path: selectedCells,
      })
      return true
    }

    playSoundEffect('invalid')
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    dispatch({ type: 'REJECT_WORD' })
    return false
  }, [levelConfig.minWordLength, language])

  const handleUsePowerUp = useCallback((power: PowerUpType) => {
    dispatch({ type: 'USE_POWER_UP', powerUp: power })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  }, [])

  const handlePause = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' })
  }, [])

  const handleResume = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' })
  }, [])

  const dispatchAction = useCallback((action: GameAction) => {
    dispatch(action)
  }, [])

  const objectiveState = stateForObjective(state)
  const bonusComplete = checkBonusComplete(objectiveState, state.bonusObjective)

  return {
    state,
    objectiveState,
    bonusComplete,
    lastWordScore: lastWordScoreRef.current,
    handleStartGame,
    handleSelectCell,
    handleDeselectLast,
    handleClearSelection,
    handleSubmitWord,
    handleUsePowerUp,
    handlePause,
    handleResume,
    dispatch: dispatchAction,
  }
}
