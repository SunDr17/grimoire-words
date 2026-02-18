import { solveBoard, scoreWord } from '@/features/board/utils/boardSolver'
import { buildTrie } from '@/features/words/utils/trie'

describe('boardSolver', () => {
  const testWords = new Set([
    'cat', 'car', 'care', 'are', 'ace', 'arc', 'ear',
    'era', 'tar', 'rat', 'art', 'eat', 'ate', 'tea',
    'rate', 'tear', 'race', 'crate', 'trace',
  ])

  describe('solveBoard', () => {
    it('finds words on a simple 4x4 grid', () => {
      const trie = buildTrie(testWords)
      const grid = [
        ['C', 'A', 'T', 'E'],
        ['R', 'A', 'C', 'E'],
        ['E', 'T', 'A', 'R'],
        ['S', 'I', 'N', 'G'],
      ]

      const result = solveBoard(grid, 4, trie, 3)
      expect(result.words.size).toBeGreaterThan(0)
      expect(result.words.has('cat')).toBe(true)
    })

    it('respects minimum word length', () => {
      const trie = buildTrie(new Set(['at', 'cat', 'rate']))
      const grid = [
        ['C', 'A'],
        ['T', 'E'],
      ]

      const result3 = solveBoard(grid, 2, trie, 3)
      expect(result3.words.has('at')).toBe(false)
      expect(result3.words.has('cat')).toBe(true)
    })

    it('works with 5x5 grid', () => {
      const trie = buildTrie(testWords)
      const grid = [
        ['C', 'A', 'T', 'E', 'R'],
        ['A', 'R', 'E', 'A', 'T'],
        ['C', 'E', 'T', 'A', 'R'],
        ['T', 'A', 'R', 'C', 'E'],
        ['E', 'R', 'A', 'C', 'E'],
      ]

      const result = solveBoard(grid, 5, trie, 3)
      expect(result.words.size).toBeGreaterThan(5)
    })

    it('does not reuse cells in a single word path', () => {
      const trie = buildTrie(testWords)
      const grid = [
        ['C', 'A'],
        ['T', 'E'],
      ]

      const result = solveBoard(grid, 2, trie, 3)
      for (const [, path] of result.words) {
        const keys = path.map((p) => `${p.row},${p.col}`)
        expect(new Set(keys).size).toBe(keys.length)
      }
    })
  })

  describe('scoreWord', () => {
    it('scores a 3-letter word with base values + length bonus', () => {
      const score = scoreWord('cat')
      // C=3, A=1, T=1 = 5 letter score + 8 length bonus = 13
      expect(score).toBe(13)
    })

    it('scores a 4-letter word with length bonus', () => {
      const score = scoreWord('rate')
      // R=1, A=1, T=1, E=1 = 4 letter score + 12 length bonus = 16
      expect(score).toBe(16)
    })

    it('applies 1.5x multiplier for 5-letter words', () => {
      const score = scoreWord('crate')
      // C=3, R=1, A=1, T=1, E=1 = 7 letter score + 18 length bonus = 25
      expect(score).toBe(Math.floor(25 * 1.5))
    })

    it('applies 2x multiplier for 6-letter words', () => {
      const score = scoreWord('crater')
      // C=3, R=1, A=1, T=1, E=1, R=1 = 8 letter score + 25 length bonus = 33
      expect(score).toBe(Math.floor(33 * 2))
    })

    it('applies 3x multiplier for 7+ letter words', () => {
      const score = scoreWord('craters')
      // C=3, R=1, A=1, T=1, E=1, R=1, S=1 = 9 letter score + 35 length bonus = 44
      expect(score).toBe(Math.floor(44 * 3))
    })

    it('scores high-value letters correctly', () => {
      const score = scoreWord('quiz')
      // Q=10, U=1, I=1, Z=10 = 22 letter score + 12 (4-letter bonus) = 34
      expect(score).toBe(34)
    })

    it('rewards longer words significantly more', () => {
      const score3 = scoreWord('cat') // 3 letters
      const score5 = scoreWord('crate') // 5 letters
      const score7 = scoreWord('craters') // 7 letters
      expect(score5).toBeGreaterThan(score3 * 2)
      expect(score7).toBeGreaterThan(score5 * 2)
    })
  })
})
