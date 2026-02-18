import type { GridPosition, Language } from '@/shared/types'
import { getAdjacentPositions, positionKey } from '@/features/grid/utils/adjacency'
import { Trie } from '@/features/words/utils/trie'

export interface SolverResult {
  readonly words: ReadonlyMap<string, readonly GridPosition[]>
  readonly totalScore: number
}

export function solveBoard(
  grid: readonly (readonly string[])[],
  gridSize: number,
  trie: Trie,
  minWordLength: number = 3,
  language: Language = 'en',
): SolverResult {
  const foundWords = new Map<string, readonly GridPosition[]>()
  const visited = new Set<string>()
  const path: GridPosition[] = []

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const pos: GridPosition = { row, col }
      const key = positionKey(pos)
      visited.add(key)
      path.push(pos)
      dfs(
        grid,
        gridSize,
        pos,
        grid[row][col],
        path,
        visited,
        trie,
        minWordLength,
        foundWords,
      )
      path.pop()
      visited.delete(key)
    }
  }

  const totalScore = calculateTotalScore(foundWords, language)
  return { words: foundWords, totalScore }
}

function dfs(
  grid: readonly (readonly string[])[],
  gridSize: number,
  position: GridPosition,
  currentWord: string,
  path: GridPosition[],
  visited: Set<string>,
  trie: Trie,
  minWordLength: number,
  foundWords: Map<string, readonly GridPosition[]>,
): void {
  const lower = currentWord.toLowerCase()

  if (!trie.hasPrefix(lower)) {
    return
  }

  if (
    currentWord.length >= minWordLength &&
    trie.hasWord(lower) &&
    !foundWords.has(lower)
  ) {
    foundWords.set(lower, [...path])
  }

  if (currentWord.length >= 10) {
    return
  }

  const neighbors = getAdjacentPositions(position, gridSize)
  for (const neighbor of neighbors) {
    const key = positionKey(neighbor)
    if (!visited.has(key)) {
      visited.add(key)
      path.push(neighbor)
      dfs(
        grid,
        gridSize,
        neighbor,
        currentWord + grid[neighbor.row][neighbor.col],
        path,
        visited,
        trie,
        minWordLength,
        foundWords,
      )
      path.pop()
      visited.delete(key)
    }
  }
}

function calculateTotalScore(
  words: ReadonlyMap<string, readonly GridPosition[]>,
  language: Language,
): number {
  let total = 0
  for (const [word] of words) {
    total += scoreWord(word, language)
  }
  return total
}

const EN_LETTER_VALUES: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4,
  I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3,
  Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8,
  Y: 4, Z: 10,
}

const RU_LETTER_VALUES: Record<string, number> = {
  А: 1, Б: 3, В: 1, Г: 3, Д: 2, Е: 1, Ж: 5, З: 5,
  И: 1, Й: 4, К: 2, Л: 2, М: 2, Н: 1, О: 1, П: 2,
  Р: 1, С: 1, Т: 1, У: 2, Ф: 10, Х: 5, Ц: 5, Ч: 5,
  Ш: 8, Щ: 10, Ы: 4, Ь: 3, Э: 8, Ю: 8, Я: 3,
}

function getLetterValues(language: Language): Record<string, number> {
  return language === 'ru' ? RU_LETTER_VALUES : EN_LETTER_VALUES
}

export function scoreWord(word: string, language: Language = 'en'): number {
  const letterValues = getLetterValues(language)

  let letterScore = 0
  for (const char of word.toUpperCase()) {
    letterScore += letterValues[char] ?? 0
  }

  const len = word.length
  const lengthBonus = len <= 3 ? 8 : len <= 4 ? 12 : len <= 5 ? 18 : len <= 6 ? 25 : 35
  const base = letterScore + lengthBonus

  if (len >= 7) return Math.floor(base * 3)
  if (len >= 6) return Math.floor(base * 2)
  if (len >= 5) return Math.floor(base * 1.5)
  return base
}
