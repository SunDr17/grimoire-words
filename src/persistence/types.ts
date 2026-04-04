import type { Language } from '@/shared/types'
import { DEFAULT_LANGUAGE } from '@/shared/i18n/languageConfig'

export interface AppSettings {
  readonly language: Language
}

export function createDefaultSettings(): AppSettings {
  return { language: DEFAULT_LANGUAGE }
}

export interface LevelProgress {
  readonly levelId: number
  readonly stars: number
  readonly highScore: number
  readonly completed: boolean
  readonly wordsFound: number
  readonly longestWord: string
}

export interface PlayerProgress {
  readonly currentLevel: number
  readonly totalStars: number
  readonly levels: Record<number, LevelProgress>
}

export interface PlayerStats {
  readonly totalWordsFound: number
  readonly totalScore: number
  readonly longestWord: string
  readonly monstersDefeated: number
  readonly gamesPlayed: number
  readonly currentStreak: number
  readonly bestStreak: number
  readonly lastPlayDate: string | null
}

export interface PlayerInventory {
  readonly scatterRune: number
  readonly sightRune: number
  readonly stasisRune: number
  readonly hitPoints: number
  readonly lastHpRegen: number
}

export function createDefaultProgress(): PlayerProgress {
  return {
    currentLevel: 1,
    totalStars: 0,
    levels: {},
  }
}

export function createDefaultStats(): PlayerStats {
  return {
    totalWordsFound: 0,
    totalScore: 0,
    longestWord: '',
    monstersDefeated: 0,
    gamesPlayed: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastPlayDate: null,
  }
}

export function createDefaultInventory(): PlayerInventory {
  return {
    scatterRune: 3,
    sightRune: 3,
    stasisRune: 3,
    hitPoints: 5,
    lastHpRegen: Date.now(),
  }
}
