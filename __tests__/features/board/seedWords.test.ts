import { selectSeedWords, shuffleArray } from '@/features/board/utils/seedWords'
import { buildTrie } from '@/features/words/utils/trie'

describe('seedWords', () => {
  const mockWords = new Set([
    'star', 'ring', 'time', 'lost', 'dark', 'mind', 'real', 'hand',
    'note', 'rain', 'tale', 'line', 'fire', 'wind', 'salt', 'dust',
    'stone', 'trail', 'night', 'light', 'dream', 'flame', 'water',
    'train', 'steal', 'stare', 'lines', 'rains', 'tones', 'notes',
    'stream', 'silent', 'listen', 'master', 'reason', 'rental',
    'mental', 'dinner', 'winter', 'sister', 'remain', 'detail',
    'strange', 'monster', 'destiny', 'distant', 'mineral', 'masters',
    'eastern', 'storing', 'sending', 'lending', 'resting', 'listing',
    'toaster', 'roasted', 'nastier', 'sardine', 'instead', 'detains',
    'miner', 'liner', 'shine', 'risen', 'diner', 'lemon',
    'стол', 'рост', 'нота', 'лето', 'сила', 'тело',
    'слово', 'место', 'стена', 'народ', 'среда',
    'монета', 'остров', 'старик', 'листок', 'костер',
    'история', 'мастера', 'старина', 'столица',
  ])

  const mockTrie = buildTrie(mockWords)

  describe('selectSeedWords', () => {
    it('returns words for a 6x6 grid', () => {
      const words = selectSeedWords(6, 'en', mockTrie)
      expect(words.length).toBeGreaterThanOrEqual(4)
      expect(words.length).toBeLessThanOrEqual(10)
    })

    it('returns words for a 7x7 grid with more long words', () => {
      const words = selectSeedWords(7, 'en', mockTrie)
      expect(words.length).toBeGreaterThanOrEqual(4)
      expect(words.length).toBeLessThanOrEqual(10)
    })

    it('only selects words present in trie', () => {
      const words = selectSeedWords(6, 'en', mockTrie)
      for (const word of words) {
        expect(mockTrie.hasWord(word.toLowerCase())).toBe(true)
      }
    })

    it('returns a mix of short, medium, and long words', () => {
      const words = selectSeedWords(6, 'en', mockTrie)
      const shortWords = words.filter((w) => w.length === 4)
      const mediumWords = words.filter((w) => w.length === 5)
      const longWords = words.filter((w) => w.length >= 6)

      expect(shortWords.length).toBeGreaterThanOrEqual(1)
      expect(mediumWords.length).toBeGreaterThanOrEqual(1)
      expect(longWords.length).toBeGreaterThanOrEqual(1)
    })

    it('works for Russian language', () => {
      const words = selectSeedWords(6, 'ru', mockTrie)
      expect(words.length).toBeGreaterThanOrEqual(1)

      for (const word of words) {
        expect(mockTrie.hasWord(word.toLowerCase())).toBe(true)
      }
    })

    it('returns empty array when no words match trie', () => {
      const emptyTrie = buildTrie(new Set<string>())
      const words = selectSeedWords(6, 'en', emptyTrie)
      expect(words).toEqual([])
    })
  })

  describe('shuffleArray', () => {
    it('returns array of same length', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect(result.length).toBe(input.length)
    })

    it('contains all original elements', () => {
      const input = [1, 2, 3, 4, 5]
      const result = shuffleArray(input)
      expect([...result].sort()).toEqual([...input].sort())
    })

    it('does not mutate original array', () => {
      const input = [1, 2, 3, 4, 5]
      const copy = [...input]
      shuffleArray(input)
      expect(input).toEqual(copy)
    })
  })
})
