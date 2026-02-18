import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  type PlayerProgress,
  type PlayerStats,
  type PlayerInventory,
  type AppSettings,
  createDefaultProgress,
  createDefaultStats,
  createDefaultInventory,
  createDefaultSettings,
} from './types'
import { type AdState, createDefaultAdState } from '@/features/ads/types'
import { type LoginRewardState, createDefaultLoginRewardState } from '@/features/retention/types'

const KEYS = {
  progress: 'grimoire_progress',
  stats: 'grimoire_stats',
  inventory: 'grimoire_inventory',
  dailyQuest: 'grimoire_daily',
  settings: 'grimoire_settings',
  adState: 'grimoire_ad_state',
  loginRewards: 'grimoire_login_rewards',
} as const

async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    throw new Error(`Failed to save ${key}: ${String(error)}`)
  }
}

export async function getProgress(): Promise<PlayerProgress> {
  return getItem(KEYS.progress, createDefaultProgress())
}

export async function saveProgress(progress: PlayerProgress): Promise<void> {
  return setItem(KEYS.progress, progress)
}

export async function getStats(): Promise<PlayerStats> {
  return getItem(KEYS.stats, createDefaultStats())
}

export async function saveStats(stats: PlayerStats): Promise<void> {
  return setItem(KEYS.stats, stats)
}

export async function getInventory(): Promise<PlayerInventory> {
  return getItem(KEYS.inventory, createDefaultInventory())
}

export async function saveInventory(inventory: PlayerInventory): Promise<void> {
  return setItem(KEYS.inventory, inventory)
}

export async function getSettings(): Promise<AppSettings> {
  return getItem(KEYS.settings, createDefaultSettings())
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  return setItem(KEYS.settings, settings)
}

export async function getAdState(): Promise<AdState> {
  return getItem(KEYS.adState, createDefaultAdState())
}

export async function saveAdState(state: AdState): Promise<void> {
  return setItem(KEYS.adState, state)
}

export async function getLoginRewards(): Promise<LoginRewardState> {
  return getItem(KEYS.loginRewards, createDefaultLoginRewardState())
}

export async function saveLoginRewards(state: LoginRewardState): Promise<void> {
  return setItem(KEYS.loginRewards, state)
}

export async function updatePlayerStats(
  wordsFound: number,
  score: number,
  isBoss: boolean,
  won: boolean,
): Promise<void> {
  const stats = await getStats()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  let newStreak = stats.currentStreak
  if (stats.lastPlayDate !== todayStr) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    newStreak = stats.lastPlayDate === yesterdayStr ? stats.currentStreak + 1 : 1
  }

  const updated: PlayerStats = {
    ...stats,
    totalWordsFound: stats.totalWordsFound + wordsFound,
    totalScore: stats.totalScore + score,
    monstersDefeated: stats.monstersDefeated + (isBoss && won ? 1 : 0),
    gamesPlayed: stats.gamesPlayed + 1,
    currentStreak: newStreak,
    bestStreak: Math.max(stats.bestStreak, newStreak),
    lastPlayDate: todayStr,
  }

  await saveStats(updated)
}

export async function restoreHPInStorage(amount: number): Promise<void> {
  const inv = await getInventory()
  const MAX_HP = 5
  const newHp = Math.min(MAX_HP, inv.hitPoints + amount)
  await saveInventory({ ...inv, hitPoints: newHp })
}

export async function updateLevelProgress(
  levelId: number,
  stars: number,
  score: number,
  wordsFound: number,
  longestWord: string,
): Promise<PlayerProgress> {
  const progress = await getProgress()
  const existing = progress.levels[levelId]

  const levelProgress = {
    levelId,
    stars: Math.max(existing?.stars ?? 0, stars),
    highScore: Math.max(existing?.highScore ?? 0, score),
    completed: true,
    wordsFound: Math.max(existing?.wordsFound ?? 0, wordsFound),
    longestWord:
      (longestWord.length > (existing?.longestWord.length ?? 0))
        ? longestWord
        : (existing?.longestWord ?? ''),
  }

  // Only advance campaign progress for campaign levels (1-100), not daily quest (999)
  const isCampaignLevel = levelId >= 1 && levelId <= 100 && levelId !== 999
  const nextCampaignLevel = isCampaignLevel
    ? Math.max(progress.currentLevel, levelId + 1)
    : progress.currentLevel

  const newProgress: PlayerProgress = {
    ...progress,
    currentLevel: nextCampaignLevel,
    totalStars: Object.values({ ...progress.levels, [levelId]: levelProgress })
      .reduce((sum, lp) => sum + lp.stars, 0),
    levels: { ...progress.levels, [levelId]: levelProgress },
  }

  await saveProgress(newProgress)
  return newProgress
}
