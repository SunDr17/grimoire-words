import type { Language } from '@/shared/types'

const EN_LETTER_WEIGHTS: Record<string, number> = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2,
  G: 2.0, H: 6.1, I: 7.0, J: 0.15, K: 0.77, L: 4.0,
  M: 2.4, N: 6.7, O: 7.5, P: 1.9, Q: 0.095, R: 6.0,
  S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.074,
}

const RU_LETTER_WEIGHTS: Record<string, number> = {
  А: 8.01, Б: 1.59, В: 4.54, Г: 1.70, Д: 2.98,
  Е: 8.45, Ж: 0.94, З: 1.65, И: 7.35, Й: 1.21,
  К: 3.49, Л: 4.40, М: 3.21, Н: 6.70, О: 10.97,
  П: 2.81, Р: 4.73, С: 5.47, Т: 6.26, У: 2.62,
  Ф: 0.26, Х: 0.97, Ц: 0.48, Ч: 1.44, Ш: 0.73,
  Щ: 0.36, Ы: 1.90, Ь: 1.74, Э: 0.32, Ю: 0.64,
  Я: 2.01,
}

const EN_VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])
const RU_VOWELS = new Set(['А', 'Е', 'И', 'О', 'У', 'Ы', 'Э', 'Ю', 'Я'])

function getWeights(language: Language): Record<string, number> {
  return language === 'ru' ? RU_LETTER_WEIGHTS : EN_LETTER_WEIGHTS
}

export function getVowels(language: Language): ReadonlySet<string> {
  return language === 'ru' ? RU_VOWELS : EN_VOWELS
}

function buildCumulativeWeights(
  weights: Record<string, number>,
): readonly { letter: string; cumWeight: number }[] {
  let cumulative = 0
  return Object.entries(weights).map(([letter, weight]) => {
    cumulative += weight
    return { letter, cumWeight: cumulative }
  })
}

function pickWeightedLetter(
  cumulative: readonly { letter: string; cumWeight: number }[],
  totalWeight: number,
  fallback: string,
): string {
  const rand = Math.random() * totalWeight
  for (const entry of cumulative) {
    if (rand <= entry.cumWeight) {
      return entry.letter
    }
  }
  return fallback
}

function randomFromSet(set: ReadonlySet<string>): string {
  const arr = Array.from(set)
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomConsonant(language: Language): string {
  const vowels = getVowels(language)
  const weights = getWeights(language)
  const consonants = Object.keys(weights).filter((l) => !vowels.has(l))
  return consonants[Math.floor(Math.random() * consonants.length)]
}

export function generateLetters(gridSize: number, language: Language = 'en'): readonly string[] {
  const weights = getWeights(language)
  const vowels = getVowels(language)
  const cumulative = buildCumulativeWeights(weights)
  const totalWeight = cumulative[cumulative.length - 1].cumWeight
  const fallback = language === 'ru' ? 'О' : 'E'

  const totalCells = gridSize * gridSize
  const minVowels = Math.ceil(totalCells * 0.30)
  const maxVowels = Math.ceil(totalCells * 0.45)

  const letters: string[] = []
  for (let i = 0; i < totalCells; i++) {
    letters.push(pickWeightedLetter(cumulative, totalWeight, fallback))
  }

  const vowelCount = letters.filter((l) => vowels.has(l)).length

  if (vowelCount < minVowels) {
    const consonantIndices = letters
      .map((l, i) => (vowels.has(l) ? -1 : i))
      .filter((i) => i >= 0)
    const needed = minVowels - vowelCount
    for (let i = 0; i < needed && i < consonantIndices.length; i++) {
      letters[consonantIndices[i]] = randomFromSet(vowels)
    }
  } else if (vowelCount > maxVowels) {
    const vowelIndices = letters
      .map((l, i) => (vowels.has(l) ? i : -1))
      .filter((i) => i >= 0)
    const excess = vowelCount - maxVowels
    for (let i = 0; i < excess && i < vowelIndices.length; i++) {
      vowelIndices[i] !== undefined && (letters[vowelIndices[i]] = randomConsonant(language))
    }
  }

  return enforceLetterLimit(letters, gridSize, cumulative, totalWeight, fallback)
}

function enforceLetterLimit(
  letters: string[],
  gridSize: number,
  cumulative: readonly { letter: string; cumWeight: number }[],
  totalWeight: number,
  fallback: string,
): readonly string[] {
  const counts = new Map<string, number>()
  for (const l of letters) {
    counts.set(l, (counts.get(l) ?? 0) + 1)
  }

  const result = [...letters]
  for (const [letter, count] of counts) {
    if (count > gridSize) {
      const indices = result
        .map((l, i) => (l === letter ? i : -1))
        .filter((i) => i >= 0)
      for (let i = gridSize; i < indices.length; i++) {
        result[indices[i]] = pickWeightedLetter(cumulative, totalWeight, fallback)
      }
    }
  }

  return result
}

export function isVowel(letter: string, language: Language = 'en'): boolean {
  return getVowels(language).has(letter.toUpperCase())
}

export function generateFillerLetters(
  count: number,
  language: Language,
  existingVowelCount: number,
  totalCells: number,
): readonly string[] {
  const weights = getWeights(language)
  const vowels = getVowels(language)
  const cumulative = buildCumulativeWeights(weights)
  const totalWeight = cumulative[cumulative.length - 1].cumWeight
  const fallback = language === 'ru' ? 'О' : 'E'

  const targetMinVowels = Math.ceil(totalCells * 0.30)
  const targetMaxVowels = Math.ceil(totalCells * 0.45)

  const letters: string[] = []
  let currentVowelCount = existingVowelCount

  for (let i = 0; i < count; i++) {
    const letter = pickWeightedLetter(cumulative, totalWeight, fallback)
    const isLetterVowel = vowels.has(letter)

    if (isLetterVowel && currentVowelCount >= targetMaxVowels) {
      letters.push(randomConsonant(language))
    } else if (!isLetterVowel && currentVowelCount < targetMinVowels && (count - i) <= (targetMinVowels - currentVowelCount)) {
      const vowelLetter = randomFromSet(vowels)
      letters.push(vowelLetter)
      currentVowelCount++
    } else {
      letters.push(letter)
      if (isLetterVowel) {
        currentVowelCount++
      }
    }
  }

  return letters
}
