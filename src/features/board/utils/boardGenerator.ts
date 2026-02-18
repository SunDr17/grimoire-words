import type { GridSize, Language } from '@/shared/types'
import { generateLetters, generateFillerLetters, getVowels } from './letterDistribution'
import { solveBoard, type SolverResult } from './boardSolver'
import { Trie } from '@/features/words/utils/trie'
import { selectSeedWords } from './seedWords'
import { placeWordsOnGrid } from './wordPlacer'

const MIN_WORDS_BY_SIZE: Record<GridSize, number> = {
  4: 15,
  5: 30,
  6: 80,
  7: 120,
}

const MIN_LONG_WORDS_BY_SIZE: Record<GridSize, number> = {
  4: 2,
  5: 3,
  6: 6,
  7: 10,
}

const SEEDED_ATTEMPTS = 50
const RANDOM_ATTEMPTS = 20

export interface GeneratedBoard {
  readonly grid: readonly (readonly string[])[]
  readonly gridSize: GridSize
  readonly solution: SolverResult
}

export function generateBoard(
  gridSize: GridSize,
  trie: Trie,
  targetScore: number,
  minWordLength: number = 3,
  language: Language = 'en',
): GeneratedBoard {
  const seededResult = generateSeededBoard(gridSize, trie, targetScore, minWordLength, language)
  if (seededResult) {
    return seededResult
  }

  const randomResult = generateRandomBoard(gridSize, trie, targetScore, minWordLength, language)
  if (randomResult) {
    return randomResult
  }

  return generateFallbackBoard(gridSize, trie, minWordLength, language)
}

function generateSeededBoard(
  gridSize: GridSize,
  trie: Trie,
  targetScore: number,
  minWordLength: number,
  language: Language,
): GeneratedBoard | null {
  const vowels = getVowels(language)

  for (let attempt = 0; attempt < SEEDED_ATTEMPTS; attempt++) {
    const seedWords = selectSeedWords(gridSize, language, trie)

    if (seedWords.length === 0) {
      return null
    }

    const partialGrid = placeWordsOnGrid(seedWords, gridSize)

    let existingVowelCount = 0
    let emptyCount = 0
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = partialGrid[row][col]
        if (cell === null) {
          emptyCount++
        } else if (vowels.has(cell)) {
          existingVowelCount++
        }
      }
    }

    const totalCells = gridSize * gridSize
    const fillerLetters = generateFillerLetters(emptyCount, language, existingVowelCount, totalCells)

    let fillerIndex = 0
    const finalGrid: string[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ''),
    )

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = partialGrid[row][col]
        if (cell !== null) {
          finalGrid[row][col] = cell
        } else {
          finalGrid[row][col] = fillerLetters[fillerIndex]
          fillerIndex++
        }
      }
    }

    const grid: readonly (readonly string[])[] = finalGrid
    const solution = solveBoard(grid, gridSize, trie, minWordLength, language)

    if (isBoardValid(solution, gridSize, targetScore)) {
      return { grid, gridSize, solution }
    }
  }

  return null
}

function generateRandomBoard(
  gridSize: GridSize,
  trie: Trie,
  targetScore: number,
  minWordLength: number,
  language: Language,
): GeneratedBoard | null {
  for (let attempt = 0; attempt < RANDOM_ATTEMPTS; attempt++) {
    const letters = generateLetters(gridSize, language)
    const grid = lettersToGrid(letters, gridSize)
    const solution = solveBoard(grid, gridSize, trie, minWordLength, language)

    if (isBoardValid(solution, gridSize, targetScore)) {
      return { grid, gridSize, solution }
    }
  }

  return null
}

function lettersToGrid(
  letters: readonly string[],
  gridSize: number,
): readonly (readonly string[])[] {
  const grid: string[][] = []
  for (let row = 0; row < gridSize; row++) {
    const rowLetters: string[] = []
    for (let col = 0; col < gridSize; col++) {
      rowLetters.push(letters[row * gridSize + col])
    }
    grid.push(rowLetters)
  }
  return grid
}

function isBoardValid(
  solution: SolverResult,
  gridSize: GridSize,
  targetScore: number,
): boolean {
  const wordCount = solution.words.size
  const minWords = MIN_WORDS_BY_SIZE[gridSize]

  if (wordCount < minWords) {
    return false
  }

  const minLongWords = MIN_LONG_WORDS_BY_SIZE[gridSize]
  const longWords = Array.from(solution.words.keys()).filter(
    (w) => w.length >= 5,
  )
  if (longWords.length < minLongWords) {
    return false
  }

  if (solution.totalScore < targetScore * 2.5) {
    return false
  }

  return true
}

function generateFallbackBoard(
  gridSize: GridSize,
  trie: Trie,
  minWordLength: number,
  language: Language,
): GeneratedBoard {
  const fallbacks: Record<Language, Record<GridSize, string>> = {
    en: {
      4: 'STARELIONDCHMP',
      5: 'STARELIONDCHMPGWBUFY',
      6: 'STARELIONDCHMPGWBUFYXVKQJZ',
      7: 'STARELIONDCHMPGWBUFYXVKQJZSTARELIONDCHMPGWBUFY',
    },
    ru: {
      4: 'СТАНЕРОЛИДКМПЧ',
      5: 'СТАНЕРОЛИДКМПЧГВБУЫЯ',
      6: 'СТАНЕРОЛИДКМПЧГВБУЫЯЖЗХЦШЬ',
      7: 'СТАНЕРОЛИДКМПЧГВБУЫЯЖЗХЦШЬСТАНЕРОЛИДКМПЧГВБУЫЯ',
    },
  }

  const totalCells = gridSize * gridSize
  const fallback = fallbacks[language][gridSize]
  const letters = fallback.slice(0, totalCells).split('')
  const pad = language === 'ru' ? 'О' : 'E'

  while (letters.length < totalCells) {
    letters.push(pad)
  }

  const grid = lettersToGrid(letters, gridSize)
  const solution = solveBoard(grid, gridSize, trie, minWordLength, language)

  return { grid, gridSize, solution }
}

export { lettersToGrid }
