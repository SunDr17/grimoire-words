import type {
  Language,
  GridSize,
  GridPosition,
  LevelConfig,
  Objective,
  BonusObjective,
  PowerUpType,
} from '@/shared/types'

export interface GameState {
  readonly levelId: number
  readonly grid: readonly (readonly string[])[]
  readonly gridSize: GridSize
  readonly selectedCells: readonly GridPosition[]
  readonly currentWord: string
  readonly foundWords: readonly string[]
  readonly foundWordPaths: ReadonlyMap<string, readonly GridPosition[]>
  readonly score: number
  readonly timeRemaining: number
  readonly maxTime: number
  readonly objective: Objective
  readonly bonusObjective: BonusObjective
  readonly usedLetterPositions: ReadonlySet<string>
  readonly status: 'intro' | 'playing' | 'paused' | 'won' | 'lost'
  readonly decayedCells: ReadonlySet<string>
  readonly hiddenCells: ReadonlySet<string>
  readonly powerUps: Record<PowerUpType, number>
  readonly powerUpsUsed: number
  readonly frozenTimer: boolean
  readonly frozenUntil: number
  readonly isBoss: boolean
  readonly levelConfig: LevelConfig
  readonly language: Language
  readonly hintCells: ReadonlySet<string>
  readonly goldenCells: ReadonlySet<string>
  readonly continueUsed: boolean
}

export type GameAction =
  | { type: 'SELECT_CELL'; position: GridPosition }
  | { type: 'DESELECT_LAST' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SUBMIT_WORD'; word: string; path: readonly GridPosition[] }
  | { type: 'REJECT_WORD' }
  | { type: 'TICK'; delta: number }
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'WIN_GAME' }
  | { type: 'LOSE_GAME' }
  | { type: 'DECAY_CELL'; position: GridPosition }
  | { type: 'HIDE_CELL'; position: GridPosition }
  | { type: 'REVEAL_CELL'; position: GridPosition }
  | { type: 'USE_POWER_UP'; powerUp: PowerUpType }
  | { type: 'FREEZE_TIMER'; duration: number }
  | { type: 'SHUFFLE_GRID'; newGrid: readonly (readonly string[])[] }
  | { type: 'DOOM_TICK'; timeLost: number }
  | { type: 'SHOW_HINT'; cells: ReadonlySet<string> }
  | { type: 'CLEAR_HINT' }
  | { type: 'CONTINUE_GAME'; extraTime: number }
