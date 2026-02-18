export type Language = 'en' | 'ru'

export type GridSize = 4 | 5 | 6 | 7

export interface GridPosition {
  readonly row: number
  readonly col: number
}

export interface LetterCell {
  readonly letter: string
  readonly position: GridPosition
  readonly lightColor: string
  readonly id: string
}

export type CellState = 'idle' | 'selected' | 'valid' | 'invalid' | 'decayed' | 'hidden' | 'hint'

export type CityId = 'thornwall' | 'hollow'

export type MonsterType = 'gloomfang' | 'blightworm' | 'unwriter' | 'nullwhisper' | 'voidmaw' | 'the_silence'

export type ObjectiveType =
  | 'scoreTarget'
  | 'wordHunter'
  | 'linguist'
  | 'wordsmith'
  | 'clearTheWall'
  | 'speedRun'

export interface Objective {
  readonly type: ObjectiveType
  readonly target: number
  readonly label: string
}

export interface BonusObjective {
  readonly type: string
  readonly target: number
  readonly label: string
}

export interface LevelConfig {
  readonly id: number
  readonly gridSize: GridSize
  readonly timer: number
  readonly objective: Objective
  readonly bonusObjective: BonusObjective
  readonly isBoss: boolean
  readonly monster?: MonsterType
  readonly darkImage?: number
  readonly locationName: string
  readonly minWordLength: number
  readonly modifier?: LevelModifier
  readonly starGateRequirement?: number
}

export interface StarRating {
  readonly stars: 1 | 2 | 3
  readonly primaryComplete: boolean
  readonly bonusComplete: boolean
}

export type PowerUpType = 'scatterRune' | 'sightRune' | 'stasisRune'

export type LevelModifier = 'longWordsOnly' | 'speedRound' | 'goldenLetters' | 'noRunes'
