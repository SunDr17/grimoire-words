import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { VHSOverlay } from '@/shared/components'
import { LightBackground } from '@/features/game/components/LightBackground'
import { LetterGrid } from '@/features/grid/components/LetterGrid'
import { WordPreview } from '@/features/game/components/WordPreview'
import { ObjectiveBar } from '@/features/game/components/ObjectiveBar'
import { FoundWordsList } from '@/features/game/components/FoundWordsList'
import { LevelIntro } from '@/features/game/components/LevelIntro'
import { RunePanel } from '@/features/game/components/RunePanel'
import { DarkBackground } from '@/features/darkLevel/components/DarkBackground'
import { ParticleAsh } from '@/features/darkLevel/components/ParticleAsh'
import { FogOverlay } from '@/features/darkLevel/components/FogOverlay'
import { LightningEffect } from '@/features/darkLevel/components/LightningEffect'
import { useDarkLevelEffects } from '@/features/darkLevel/hooks/useDarkLevelEffects'
import { useGameLoop } from '@/features/game/hooks/useGameLoop'
import { getLevelConfig } from '@/features/game/utils/levelConfig'
import { generateBoard } from '@/features/board/utils/boardGenerator'
import { solveBoard } from '@/features/board/utils/boardSolver'
import { generateLetters } from '@/features/board/utils/letterDistribution'
import { useDictionary } from '@/features/words/DictionaryProvider'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import {
  checkObjectiveComplete,
  checkBonusComplete,
  type GameStateForObjective,
} from '@/features/game/utils/objectives'
import { useAudio } from '@/audio/AudioProvider'
import { positionKey } from '@/features/grid/utils/adjacency'
import type { GridPosition, Language, PowerUpType } from '@/shared/types'
import type { Trie } from '@/features/words/utils/trie'
import { ContinueModal } from '@/features/ads/components/ContinueModal'
import { useAds } from '@/features/ads/hooks/useAds'
import { usePowerUps } from '@/features/game/hooks/usePowerUps'
import { getInventory } from '@/persistence/storage'

export default function LevelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const levelId = parseInt(id ?? '1', 10)
  const { trie } = useDictionary()
  const { language } = useLanguage()

  const [inventoryCounts, setInventoryCounts] = useState<Record<PowerUpType, number> | null>(null)

  useEffect(() => {
    getInventory().then((inv) => {
      setInventoryCounts({
        scatterRune: inv.scatterRune,
        sightRune: inv.sightRune,
        stasisRune: inv.stasisRune,
      })
    })
  }, [])

  const levelConfig = useMemo(() => getLevelConfig(levelId, language), [levelId, language])

  const board = useMemo(() => {
    if (!trie) return null
    const targetScore = levelConfig.objective.type === 'scoreTarget'
      ? levelConfig.objective.target
      : 200
    return generateBoard(levelConfig.gridSize, trie, targetScore, levelConfig.minWordLength, language)
  }, [trie, levelConfig, language])

  const lightColors = useMemo(
    () =>
      Array.from(
        { length: levelConfig.gridSize * levelConfig.gridSize },
        (_, i) => COLORS.wardStones[i % COLORS.wardStones.length],
      ),
    [levelConfig.gridSize],
  )

  if (!board || !trie || !inventoryCounts) {
    return <View style={styles.loading} />
  }

  return (
    <GamePlayContent
      levelConfig={levelConfig}
      board={board}
      lightColors={lightColors}
      language={language}
      trie={trie}
      inventoryCounts={inventoryCounts}
    />
  )
}

interface GamePlayContentProps {
  readonly levelConfig: ReturnType<typeof getLevelConfig>
  readonly board: ReturnType<typeof generateBoard>
  readonly lightColors: readonly string[]
  readonly language: Language
  readonly trie: Trie
  readonly inventoryCounts: Record<PowerUpType, number>
}

function calculateStars(
  objectiveState: GameStateForObjective,
  objective: ReturnType<typeof getLevelConfig>['objective'],
  bonusObjective: ReturnType<typeof getLevelConfig>['bonusObjective'],
  won: boolean,
): number {
  if (!won) return 0

  const bonusDone = checkBonusComplete(objectiveState, bonusObjective)
  if (bonusDone) return 3

  const score = objectiveState.score
  const target = objective.type === 'scoreTarget' ? objective.target : 0
  if (target > 0 && score >= target * 1.5) return 2
  if (objectiveState.foundWords.length >= 8) return 2

  return 1
}

function GamePlayContent({ levelConfig, board, lightColors, language, trie, inventoryCounts }: GamePlayContentProps) {
  const isDark = levelConfig.isBoss
  const {
    state,
    objectiveState,
    handleStartGame,
    handleSelectCell,
    handleDeselectLast,
    handleClearSelection,
    handleSubmitWord,
    handleUsePowerUp,
    dispatch,
  } = useGameLoop({ levelConfig, grid: board.grid, language, inventoryCounts })
  const { rewardedReady, tryShowRewarded } = useAds()
  const { spendPowerUp } = usePowerUps()
  const [showContinue, setShowContinue] = React.useState(false)

  const objectiveStateRef = React.useRef(objectiveState)
  objectiveStateRef.current = objectiveState
  const foundWordsRef = React.useRef(state.foundWords)
  foundWordsRef.current = state.foundWords
  const gridRef = React.useRef(state.grid)
  gridRef.current = state.grid

  useDarkLevelEffects({
    monster: levelConfig.monster,
    gridSize: levelConfig.gridSize,
    decayedCells: state.decayedCells,
    dispatch,
    isPlaying: state.status === 'playing',
  })

  const { playMusic, stopMusic } = useAudio()

  const musicStarted = React.useRef(false)

  React.useEffect(() => {
    if ((state.status === 'intro' || state.status === 'playing') && !musicStarted.current) {
      musicStarted.current = true
      playMusic(isDark ? 'dark' : 'light')
    }
    if (state.status === 'won' || state.status === 'lost') {
      musicStarted.current = false
      stopMusic()
    }
  }, [state.status, isDark, playMusic, stopMusic])

  React.useEffect(() => {
    return () => {
      stopMusic()
    }
  }, [stopMusic])

  const hintTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePowerUp = useCallback(
    (power: PowerUpType) => {
      handleUsePowerUp(power)
      spendPowerUp(power)

      if (power === 'stasisRune') {
        dispatch({ type: 'FREEZE_TIMER', duration: 10 })
      }

      if (power === 'scatterRune') {
        const letters = generateLetters(levelConfig.gridSize, language)
        const newGrid: string[][] = []
        for (let row = 0; row < levelConfig.gridSize; row++) {
          const rowLetters: string[] = []
          for (let col = 0; col < levelConfig.gridSize; col++) {
            rowLetters.push(letters[row * levelConfig.gridSize + col])
          }
          newGrid.push(rowLetters)
        }
        dispatch({ type: 'SHUFFLE_GRID', newGrid })
      }

      if (power === 'sightRune') {
        const currentGrid = gridRef.current
        const result = solveBoard(currentGrid, levelConfig.gridSize, trie, levelConfig.minWordLength, language)
        const currentFoundWords = foundWordsRef.current
        let bestWord: string | null = null
        let bestPath: readonly GridPosition[] = []

        for (const [word, path] of result.words) {
          if (currentFoundWords.includes(word)) continue
          if (!bestWord || word.length > bestWord.length) {
            bestWord = word
            bestPath = path
          }
        }

        if (bestWord && bestPath.length > 0) {
          const hintKeys = new Set(bestPath.map((p) => positionKey(p)))
          dispatch({ type: 'SHOW_HINT', cells: hintKeys })

          if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
          hintTimerRef.current = setTimeout(() => {
            dispatch({ type: 'CLEAR_HINT' })
          }, 5000)
        }
      }
    },
    [handleUsePowerUp, spendPowerUp, dispatch, levelConfig.gridSize, levelConfig.minWordLength, language, trie],
  )

  React.useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
  }, [])

  const handleExit = useCallback(() => {
    router.back()
  }, [])

  const handleLevelComplete = useCallback(() => {
    const won = state.status === 'won'
    const stars = calculateStars(objectiveStateRef.current, levelConfig.objective, levelConfig.bonusObjective, won)
    router.replace(
      `/results/${levelConfig.id}?score=${state.score}&stars=${stars}&words=${state.foundWords.length}`,
    )
  }, [levelConfig, state.score, state.status, state.foundWords.length])

  const handleContinueAd = React.useCallback(async () => {
    const rewarded = await tryShowRewarded('continue')
    if (rewarded) {
      setShowContinue(false)
      dispatch({ type: 'CONTINUE_GAME', extraTime: 30 })
    }
  }, [tryShowRewarded, dispatch])

  const handleDeclineContinue = React.useCallback(() => {
    setShowContinue(false)
    handleLevelComplete()
  }, [handleLevelComplete])

  React.useEffect(() => {
    if (state.status === 'won') {
      const timeout = setTimeout(handleLevelComplete, 1500)
      return () => clearTimeout(timeout)
    }
    if (state.status === 'lost') {
      // Offer continue for non-boss levels if not already used
      if (!state.continueUsed && !levelConfig.isBoss) {
        setShowContinue(true)
        return
      }
      const timeout = setTimeout(handleLevelComplete, 1500)
      return () => clearTimeout(timeout)
    }
  }, [state.status, state.continueUsed, levelConfig.isBoss, handleLevelComplete])

  const content = (
    <SafeAreaView style={styles.gameContainer}>
      {state.status === 'intro' && (
        <LevelIntro config={levelConfig} onComplete={handleStartGame} />
      )}

      {/* Top bar with exit + objective */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit} activeOpacity={0.7}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.objectiveBarWrapper}>
          <ObjectiveBar
            objective={state.objective}
            bonusObjective={state.bonusObjective}
            gameState={objectiveState}
            timeRemaining={state.timeRemaining}
            maxTime={state.maxTime}
            score={state.score}
            frozen={state.frozenTimer}
          />
        </View>
      </View>

      <View style={styles.gameContent}>
        <WordPreview currentWord={state.currentWord} isDark={isDark} />

        <LetterGrid
          grid={state.grid}
          gridSize={state.gridSize}
          selectedCells={state.selectedCells}
          decayedCells={state.decayedCells}
          hiddenCells={state.hiddenCells}
          hintCells={state.hintCells}
          goldenCells={state.goldenCells}
          lightColors={lightColors as string[]}
          onSelect={handleSelectCell}
          onDeselect={handleDeselectLast}
          onClear={handleClearSelection}
          onSubmit={handleSubmitWord}
          enabled={state.status === 'playing'}
          isDark={isDark}
        />

        <FoundWordsList words={state.foundWords} />
      </View>

      <RunePanel
        powerUps={state.powerUps}
        onUsePower={handlePowerUp}
        enabled={state.status === 'playing'}
      />
    </SafeAreaView>
  )

  const continueModal = (
    <ContinueModal
      visible={showContinue}
      rewardedReady={rewardedReady}
      onWatchAd={handleContinueAd}
      onDecline={handleDeclineContinue}
    />
  )

  if (isDark && levelConfig.darkImage) {
    return (
      <DarkBackground imageIndex={levelConfig.darkImage}>
        {content}
        <ParticleAsh />
        <FogOverlay />
        <LightningEffect enabled={state.status === 'playing'} />
        {continueModal}
      </DarkBackground>
    )
  }

  return (
    <LightBackground levelId={levelConfig.id}>
      <VHSOverlay />
      {content}
      {continueModal}
    </LightBackground>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.thornwall.primary,
  },
  gameContainer: {
    flex: 1,
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: SPACING.sm,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '77',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  exitText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.ui.textDim,
    lineHeight: FONT_SIZES.lg + 2,
  },
  objectiveBarWrapper: {
    flex: 1,
  },
})
