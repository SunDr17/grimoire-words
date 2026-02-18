import type { GridSize, Language } from '@/shared/types'
import type { Trie } from '@/features/words/utils/trie'

const EN_SEED_WORDS: Record<number, readonly string[]> = {
  4: [
    'star', 'ring', 'time', 'lost', 'dark', 'mind', 'real', 'hand',
    'note', 'rain', 'tale', 'line', 'fire', 'wind', 'salt', 'dust',
    'tone', 'rise', 'lane', 'mist',
  ],
  5: [
    'stone', 'trail', 'night', 'light', 'dream', 'flame', 'water',
    'train', 'steal', 'stare', 'lines', 'rains', 'tones', 'notes',
    'miner', 'liner', 'shine', 'risen', 'diner', 'lemon',
  ],
  6: [
    'stream', 'silent', 'listen', 'master', 'reason', 'rental',
    'mental', 'dinner', 'winter', 'sister', 'instal', 'remain',
    'detail', 'senior', 'orient', 'mister', 'retain', 'stoned',
    'linter', 'nested',
  ],
  7: [
    'strange', 'monster', 'destiny', 'distant', 'mineral', 'masters',
    'eastern', 'storing', 'sending', 'lending', 'resting', 'listing',
    'toaster', 'roasted', 'nastier', 'sardine', 'instead', 'detains',
    'stainer', 'trained',
  ],
}

const RU_SEED_WORDS: Record<number, readonly string[]> = {
  4: [
    'стол', 'рост', 'нота', 'лето', 'сила', 'тело', 'сено', 'село',
    'роса', 'лист', 'коса', 'нора', 'тени', 'сети', 'сорт', 'торс',
    'рота', 'кора', 'рано', 'тона',
  ],
  5: [
    'слово', 'место', 'лесно', 'стена', 'монет', 'серна', 'ответ',
    'нести', 'тонер', 'лиана', 'сторо', 'ранет', 'народ', 'среда',
    'носит', 'несло', 'стоит', 'лесна', 'стали', 'тесно',
  ],
  6: [
    'монета', 'остров', 'стенол', 'ответа', 'старик', 'листок',
    'тонера', 'солнце', 'сторон', 'костер', 'мастер', 'клетка',
    'минута', 'нитрат', 'стекло', 'ранета', 'ростка', 'монист',
    'сенато', 'ремонт',
  ],
  7: [
    'история', 'монстер', 'мастера', 'старина', 'ответил', 'минерал',
    'столица', 'востока', 'ремонта', 'костера', 'листами', 'сетевой',
    'ростами', 'нотариа', 'состоит', 'минерат', 'сенатор', 'диктант',
    'интерна', 'рисован',
  ],
}

function getSeedWordList(language: Language): Record<number, readonly string[]> {
  return language === 'ru' ? RU_SEED_WORDS : EN_SEED_WORDS
}

export function shuffleArray<T>(arr: readonly T[]): readonly T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export function selectSeedWords(
  gridSize: GridSize,
  language: Language,
  trie: Trie,
): readonly string[] {
  const wordsByLength = getSeedWordList(language)

  const shortWords = filterValidWords(wordsByLength[4] ?? [], trie, language)
  const mediumWords = filterValidWords(wordsByLength[5] ?? [], trie, language)
  const longWords = filterValidWords(
    [...(wordsByLength[6] ?? []), ...(wordsByLength[7] ?? [])],
    trie,
    language,
  )

  const shortCount = 2
  const mediumCount = 3
  const longCount = gridSize >= 6 ? 3 : 2

  const selected = [
    ...pickRandom(shortWords, shortCount),
    ...pickRandom(mediumWords, mediumCount),
    ...pickRandom(longWords, longCount),
  ]

  return selected
}

function filterValidWords(
  words: readonly string[],
  trie: Trie,
  _language: Language,
): readonly string[] {
  return words.filter((w) => trie.hasWord(w.toLowerCase()))
}

function pickRandom(words: readonly string[], count: number): readonly string[] {
  const shuffled = shuffleArray(words)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
