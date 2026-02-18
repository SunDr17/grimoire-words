import type { GameState, GameAction } from './gameTypes'
import type { Language, LevelConfig, GridPosition, PowerUpType } from '@/shared/types'
import { scoreWord } from '@/features/board/utils/boardSolver'
import { areAdjacent, positionKey } from '@/features/grid/utils/adjacency'

function generateGoldenCells(
  gridSize: number,
  modifier: string | undefined,
): ReadonlySet<string> {
  if (modifier !== 'goldenLetters') return new Set()

  const totalCells = gridSize * gridSize
  const goldenCount = Math.floor(totalCells * 0.2)
  const cells = new Set<string>()

  while (cells.size < goldenCount) {
    const row = Math.floor(Math.random() * gridSize)
    const col = Math.floor(Math.random() * gridSize)
    cells.add(`${row},${col}`)
  }

  return cells
}

export function createInitialState(
  levelConfig: LevelConfig,
  grid: readonly (readonly string[])[],
  language: Language = 'en',
  inventoryCounts?: Record<PowerUpType, number>,
): GameState {
  const noRunes = levelConfig.modifier === 'noRunes'
  const defaultCounts: Record<PowerUpType, number> = { scatterRune: 1, sightRune: 1, stasisRune: 1 }
  const powerUpCounts = inventoryCounts ?? defaultCounts

  return {
    levelId: levelConfig.id,
    grid,
    gridSize: levelConfig.gridSize,
    selectedCells: [],
    currentWord: '',
    foundWords: [],
    foundWordPaths: new Map(),
    score: 0,
    timeRemaining: levelConfig.timer,
    maxTime: levelConfig.timer,
    objective: levelConfig.objective,
    bonusObjective: levelConfig.bonusObjective,
    usedLetterPositions: new Set(),
    status: 'intro',
    decayedCells: new Set(),
    hiddenCells: new Set(),
    powerUps: noRunes
      ? { scatterRune: 0, sightRune: 0, stasisRune: 0 }
      : powerUpCounts,
    powerUpsUsed: 0,
    frozenTimer: false,
    frozenUntil: 0,
    isBoss: levelConfig.isBoss,
    levelConfig,
    language,
    hintCells: new Set(),
    goldenCells: generateGoldenCells(levelConfig.gridSize, levelConfig.modifier),
    continueUsed: false,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL':
      return handleSelectCell(state, action.position)

    case 'DESELECT_LAST':
      return handleDeselectLast(state)

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedCells: [],
        currentWord: '',
      }

    case 'SUBMIT_WORD':
      return handleSubmitWord(state, action.word, action.path)

    case 'REJECT_WORD':
      return {
        ...state,
        selectedCells: [],
        currentWord: '',
      }

    case 'TICK':
      return handleTick(state, action.delta)

    case 'START_GAME':
      return { ...state, status: 'playing' }

    case 'PAUSE_GAME':
      return { ...state, status: 'paused' }

    case 'RESUME_GAME':
      return { ...state, status: 'playing' }

    case 'WIN_GAME':
      return { ...state, status: 'won' }

    case 'LOSE_GAME':
      return { ...state, status: 'lost' }

    case 'DECAY_CELL':
      return {
        ...state,
        decayedCells: new Set([...state.decayedCells, positionKey(action.position)]),
      }

    case 'HIDE_CELL':
      return {
        ...state,
        hiddenCells: new Set([...state.hiddenCells, positionKey(action.position)]),
      }

    case 'REVEAL_CELL':
      return {
        ...state,
        hiddenCells: new Set(
          [...state.hiddenCells].filter((k) => k !== positionKey(action.position)),
        ),
      }

    case 'USE_POWER_UP': {
      const currentCount = state.powerUps[action.powerUp]
      if (currentCount <= 0) return state
      return {
        ...state,
        powerUps: {
          ...state.powerUps,
          [action.powerUp]: currentCount - 1,
        },
        powerUpsUsed: state.powerUpsUsed + 1,
      }
    }

    case 'FREEZE_TIMER':
      return {
        ...state,
        frozenTimer: true,
        frozenUntil: Date.now() + action.duration * 1000,
      }

    case 'SHUFFLE_GRID':
      return {
        ...state,
        grid: action.newGrid,
        selectedCells: [],
        currentWord: '',
      }

    case 'DOOM_TICK':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - action.timeLost),
      }

    case 'SHOW_HINT':
      return { ...state, hintCells: action.cells }

    case 'CLEAR_HINT':
      return { ...state, hintCells: new Set() }

    case 'CONTINUE_GAME':
      return {
        ...state,
        status: 'playing',
        timeRemaining: action.extraTime,
        continueUsed: true,
      }
  }
}

function handleSelectCell(state: GameState, position: GridPosition): GameState {
  if (state.status !== 'playing') return state

  const key = positionKey(position)
  if (state.decayedCells.has(key)) return state
  if (state.hiddenCells.has(key)) return state

  const alreadySelected = state.selectedCells.findIndex(
    (c) => c.row === position.row && c.col === position.col,
  )

  if (alreadySelected >= 0) {
    if (alreadySelected === state.selectedCells.length - 2) {
      return handleDeselectLast(state)
    }
    return state
  }

  if (state.selectedCells.length > 0) {
    const lastCell = state.selectedCells[state.selectedCells.length - 1]
    if (!areAdjacent(lastCell, position)) {
      return state
    }
  }

  const letter = state.grid[position.row][position.col]
  return {
    ...state,
    selectedCells: [...state.selectedCells, position],
    currentWord: state.currentWord + letter,
  }
}

function handleDeselectLast(state: GameState): GameState {
  if (state.selectedCells.length === 0) return state

  const newSelected = state.selectedCells.slice(0, -1)
  const newWord = newSelected
    .map((pos) => state.grid[pos.row][pos.col])
    .join('')

  return {
    ...state,
    selectedCells: newSelected,
    currentWord: newWord,
  }
}

function handleSubmitWord(
  state: GameState,
  word: string,
  path: readonly GridPosition[],
): GameState {
  if (state.foundWords.includes(word.toLowerCase())) {
    return { ...state, selectedCells: [], currentWord: '' }
  }

  let wordScore = scoreWord(word, state.language)

  // Golden cells 2x bonus
  if (state.goldenCells.size > 0) {
    const hasGolden = path.some((pos) => state.goldenCells.has(positionKey(pos)))
    if (hasGolden) {
      wordScore = wordScore * 2
    }
  }

  const newUsed = new Set(state.usedLetterPositions)
  for (const pos of path) {
    newUsed.add(positionKey(pos))
  }

  const newFoundWordPaths = new Map(state.foundWordPaths)
  newFoundWordPaths.set(word.toLowerCase(), path)

  return {
    ...state,
    foundWords: [...state.foundWords, word.toLowerCase()],
    foundWordPaths: newFoundWordPaths,
    score: state.score + wordScore,
    usedLetterPositions: newUsed,
    selectedCells: [],
    currentWord: '',
  }
}

function handleTick(state: GameState, delta: number): GameState {
  if (state.status !== 'playing') return state
  if (state.frozenTimer && Date.now() < state.frozenUntil) return state

  const frozenTimer = state.frozenTimer && Date.now() >= state.frozenUntil
    ? false
    : state.frozenTimer

  const newTime = Math.max(0, state.timeRemaining - delta)

  return {
    ...state,
    timeRemaining: newTime,
    frozenTimer,
    status: newTime <= 0 ? 'lost' : state.status,
  }
}
