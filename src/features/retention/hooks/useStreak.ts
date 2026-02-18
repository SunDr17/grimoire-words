import { useState, useEffect, useCallback } from 'react'
import { getStats, saveStats } from '@/persistence/storage'
import { getDailyDateString } from '@/features/retention/utils/dailySeed'

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  useEffect(() => {
    getStats().then((stats) => {
      setStreak(stats.currentStreak)
      setBestStreak(stats.bestStreak)
    })
  }, [])

  const recordPlay = useCallback(async () => {
    const stats = await getStats()
    const today = getDailyDateString()

    if (stats.lastPlayDate === today) return stats

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    const isConsecutive = stats.lastPlayDate === yesterdayStr
    const newStreak = isConsecutive ? stats.currentStreak + 1 : 1
    const newBest = Math.max(stats.bestStreak, newStreak)

    const updated = {
      ...stats,
      currentStreak: newStreak,
      bestStreak: newBest,
      lastPlayDate: today,
      gamesPlayed: stats.gamesPlayed + 1,
    }

    await saveStats(updated)
    setStreak(newStreak)
    setBestStreak(newBest)
    return updated
  }, [])

  return { streak, bestStreak, recordPlay }
}
