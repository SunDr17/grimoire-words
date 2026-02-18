import type { GridSize, LevelConfig, MonsterType, Language, LevelModifier } from '@/shared/types'
import { createObjective, createBonusLabel } from './objectives'
import { THORNWALL_LOCATIONS } from '@/features/map/utils/thornwallLocations'
import { HOLLOW_LOCATIONS } from '@/features/map/utils/hollowLocations'

const STAR_GATE_LEVELS: Readonly<Record<number, number>> = {
  // Thornwall
  15: 10,
  25: 25,
  35: 45,
  45: 65,
  50: 80,
  // Hollow
  65: 90,
  75: 110,
  85: 130,
  95: 160,
  100: 190,
}

export function getStarGateRequirement(level: number): number | undefined {
  return STAR_GATE_LEVELS[level]
}

const MODIFIER_LEVELS: Readonly<Record<number, LevelModifier>> = {
  // Thornwall
  11: 'longWordsOnly',
  14: 'speedRound',
  17: 'goldenLetters',
  19: 'noRunes',
  22: 'longWordsOnly',
  24: 'speedRound',
  26: 'goldenLetters',
  28: 'noRunes',
  31: 'longWordsOnly',
  33: 'speedRound',
  36: 'goldenLetters',
  38: 'noRunes',
  41: 'longWordsOnly',
  43: 'speedRound',
  46: 'goldenLetters',
  48: 'noRunes',
  // Hollow
  61: 'longWordsOnly',
  64: 'speedRound',
  67: 'goldenLetters',
  69: 'noRunes',
  72: 'longWordsOnly',
  74: 'speedRound',
  76: 'goldenLetters',
  78: 'noRunes',
  81: 'longWordsOnly',
  83: 'speedRound',
  86: 'goldenLetters',
  88: 'noRunes',
  91: 'longWordsOnly',
  93: 'speedRound',
  96: 'goldenLetters',
  98: 'noRunes',
}

function getLevelModifier(level: number): LevelModifier | undefined {
  return MODIFIER_LEVELS[level]
}

function getLocationNameForLevel(level: number, language: Language): string {
  if (level >= 51 && level <= 100) {
    const loc = HOLLOW_LOCATIONS[(level - 51) % HOLLOW_LOCATIONS.length]
    return loc.name[language]
  }
  const loc = THORNWALL_LOCATIONS[(level - 1) % THORNWALL_LOCATIONS.length]
  return loc.name[language]
}

const DAILY_LEVEL_ID = 999

function getGridSize(level: number): GridSize {
  if (level <= 24) return 6
  if (level <= 74) return 6
  return 7
}

function isBossLevel(level: number): boolean {
  return level >= 1 && level <= 100 && level % 5 === 0
}

function getMonster(level: number): MonsterType | undefined {
  if (!isBossLevel(level)) return undefined
  // Thornwall
  if (level <= 15) return 'gloomfang'
  if (level <= 30) return 'blightworm'
  if (level <= 50) return 'unwriter'
  // Hollow
  if (level <= 65) return 'nullwhisper'
  if (level <= 80) return 'voidmaw'
  return 'the_silence'
}

function getDarkImage(level: number): number | undefined {
  if (!isBossLevel(level)) return undefined
  const monster = getMonster(level)
  switch (monster) {
    case 'gloomfang': return 1
    case 'blightworm': return level <= 25 ? 2 : 3
    case 'unwriter': return level <= 40 ? 4 : 5
    // Hollow monsters reuse images for now
    case 'nullwhisper': return 1
    case 'voidmaw': return 2
    case 'the_silence': return 4
    default: return undefined
  }
}

function getTimer(level: number, gridSize: GridSize, boss: boolean): number {
  const baseTimes: Record<GridSize, number> = {
    4: 90,
    5: 100,
    6: 120,
    7: 150,
  }

  const base = baseTimes[gridSize]
  return boss ? base + 30 : base
}

export function getDailyLevelConfig(language: Language = 'en'): LevelConfig {
  return {
    id: DAILY_LEVEL_ID,
    gridSize: 6,
    timer: 180,
    objective: createObjective('scoreTarget', 80, language),
    bonusObjective: {
      type: 'longWord',
      target: 6,
      label: createBonusLabel('longWord', 6, language),
    },
    isBoss: false,
    monster: undefined,
    darkImage: undefined,
    locationName: language === 'ru' ? 'Ежедневное задание' : 'Daily Quest',
    minWordLength: 3,
  }
}

export function getLevelConfig(level: number, language: Language = 'en'): LevelConfig {
  // Daily quest
  if (level === DAILY_LEVEL_ID) {
    return getDailyLevelConfig(language)
  }

  // Clamp to valid range
  const safeLevel = Math.max(1, Math.min(100, Math.floor(level) || 1))

  const boss = isBossLevel(safeLevel)
  const gridSize: GridSize = boss ? 7 : getGridSize(safeLevel)
  const modifier = boss ? undefined : getLevelModifier(safeLevel)
  const starGate = getStarGateRequirement(safeLevel)

  const baseTimer = getTimer(safeLevel, gridSize, boss)
  const timer = modifier === 'speedRound' ? Math.floor(baseTimer / 2) : baseTimer
  const minWordLength = modifier === 'longWordsOnly' ? 5 : 3

  const baseObjective = getLevelObjective(safeLevel, language)
  const objective = modifier === 'speedRound'
    ? createObjective(
        baseObjective.type,
        Math.ceil(baseObjective.target / 2),
        language,
      )
    : baseObjective

  return {
    id: safeLevel,
    gridSize,
    timer,
    objective,
    bonusObjective: getLevelBonus(safeLevel, language),
    isBoss: boss,
    monster: getMonster(safeLevel),
    darkImage: getDarkImage(safeLevel),
    locationName: getLocationNameForLevel(safeLevel, language),
    minWordLength,
    modifier,
    starGateRequirement: starGate,
  }
}

function getLevelObjective(level: number, language: Language) {
  // Early levels: simple score targets
  if (level <= 5) {
    return createObjective('scoreTarget', 40 + (level - 1) * 15, language)
  }

  // Thornwall boss levels
  if (isBossLevel(level) && level <= 50) {
    if (level <= 15) return createObjective('scoreTarget', 100 + level * 8, language)
    if (level === 20) return createObjective('clearTheWall', 0, language)
    if (level <= 30) return createObjective('wordHunter', 6 + Math.floor(level / 10), language)
    if (level === 40) return createObjective('linguist', 5, language)
    return createObjective('scoreTarget', 150 + level * 6, language)
  }

  // Hollow boss levels (~25% harder)
  if (isBossLevel(level) && level >= 51) {
    if (level <= 65) return createObjective('scoreTarget', 200 + level * 8, language)
    if (level === 70) return createObjective('clearTheWall', 0, language)
    if (level <= 80) return createObjective('wordHunter', 8 + Math.floor(level / 10), language)
    if (level === 90) return createObjective('linguist', 7, language)
    return createObjective('scoreTarget', 250 + level * 6, language)
  }

  // Hollow non-boss levels (~25% harder targets)
  if (level >= 51) {
    const types: readonly import('@/shared/types').ObjectiveType[] = [
      'scoreTarget',
      'wordHunter',
      'linguist',
      'wordsmith',
      'clearTheWall',
      'speedRun',
    ]
    const typeIndex = (level - 51) % types.length
    const type = types[typeIndex]

    switch (type) {
      case 'wordHunter':
        return createObjective('wordHunter', 5 + Math.floor(level / 10), language)
      case 'linguist':
        return createObjective('linguist', 3 + Math.floor(level / 15), language)
      case 'wordsmith':
        return createObjective('wordsmith', 6 + Math.floor(level / 20), language)
      case 'clearTheWall':
        return createObjective('clearTheWall', 0, language)
      case 'speedRun':
        return createObjective('speedRun', 4 + Math.floor(level / 15), language)
      default:
        return createObjective('scoreTarget', 75 + level * 6, language)
    }
  }

  // Thornwall non-boss levels (6-50)
  const types: readonly import('@/shared/types').ObjectiveType[] = [
    'scoreTarget',
    'wordHunter',
    'linguist',
    'wordsmith',
    'clearTheWall',
    'speedRun',
  ]
  const typeIndex = (level - 6) % types.length
  const type = types[typeIndex]

  switch (type) {
    case 'wordHunter':
      return createObjective('wordHunter', 4 + Math.floor(level / 10), language)
    case 'linguist':
      return createObjective('linguist', 2 + Math.floor(level / 15), language)
    case 'wordsmith':
      return createObjective('wordsmith', 5 + Math.floor(level / 20), language)
    case 'clearTheWall':
      return createObjective('clearTheWall', 0, language)
    case 'speedRun':
      return createObjective('speedRun', 3 + Math.floor(level / 15), language)
    default:
      return createObjective('scoreTarget', 50 + level * 6, language)
  }
}

function getLevelBonus(level: number, language: Language) {
  const bonusTypes = ['longWord', 'highScore', 'timeRemaining', 'noPowerUps'] as const
  const safeLevel = Math.max(1, Math.min(100, level))
  const type = bonusTypes[(safeLevel - 1) % bonusTypes.length]

  // Hollow levels have ~25% harder bonus targets
  const isHollow = safeLevel >= 51
  const targets: Record<typeof type, number> = {
    longWord: isHollow ? 6 : 5,
    highScore: isHollow ? 125 + safeLevel * 6 : 100 + safeLevel * 6,
    timeRemaining: isHollow ? 15 : 20,
    noPowerUps: 0,
  }

  return {
    type,
    target: targets[type],
    label: createBonusLabel(type, targets[type], language),
  }
}

export function getAllLevelConfigs(language: Language = 'en'): readonly LevelConfig[] {
  return Array.from({ length: 100 }, (_, i) => getLevelConfig(i + 1, language))
}
