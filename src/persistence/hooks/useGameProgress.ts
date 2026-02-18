import { useState, useEffect, useCallback } from 'react'
import { type PlayerProgress, createDefaultProgress } from '@/persistence/types'
import { getProgress, saveProgress, updateLevelProgress } from '@/persistence/storage'
import { useFocusEffect } from 'expo-router'

export function useGameProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(createDefaultProgress())
  const [loading, setLoading] = useState(true)

  const loadProgress = useCallback(() => {
    getProgress().then((p) => {
      setProgress(p)
      setLoading(false)
    })
  }, [])

  // Load on mount
  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  // Reload every time the screen gains focus (e.g. returning from results)
  useFocusEffect(
    useCallback(() => {
      loadProgress()
    }, [loadProgress]),
  )

  const completeLevelAction = useCallback(
    async (
      levelId: number,
      stars: number,
      score: number,
      wordsFound: number,
      longestWord: string,
    ) => {
      const updated = await updateLevelProgress(levelId, stars, score, wordsFound, longestWord)
      setProgress(updated)
      return updated
    },
    [],
  )

  const isLevelUnlocked = useCallback(
    (levelId: number) => levelId <= progress.currentLevel,
    [progress.currentLevel],
  )

  const getLevelStars = useCallback(
    (levelId: number) => progress.levels[levelId]?.stars ?? 0,
    [progress.levels],
  )

  return {
    progress,
    loading,
    completeLevel: completeLevelAction,
    isLevelUnlocked,
    getLevelStars,
  }
}
