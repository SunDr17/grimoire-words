import { Trie, buildTrie } from '@/features/words/utils/trie'

describe('Trie', () => {
  let trie: Trie

  beforeEach(() => {
    trie = new Trie()
    trie.insert('cat')
    trie.insert('car')
    trie.insert('card')
    trie.insert('care')
    trie.insert('careful')
    trie.insert('dog')
  })

  describe('hasWord', () => {
    it('finds inserted words', () => {
      expect(trie.hasWord('cat')).toBe(true)
      expect(trie.hasWord('car')).toBe(true)
      expect(trie.hasWord('card')).toBe(true)
      expect(trie.hasWord('care')).toBe(true)
      expect(trie.hasWord('dog')).toBe(true)
    })

    it('is case insensitive', () => {
      expect(trie.hasWord('CAT')).toBe(true)
      expect(trie.hasWord('Cat')).toBe(true)
    })

    it('returns false for non-existent words', () => {
      expect(trie.hasWord('cap')).toBe(false)
      expect(trie.hasWord('do')).toBe(false)
      expect(trie.hasWord('xyz')).toBe(false)
    })

    it('does not find prefixes that are not words', () => {
      expect(trie.hasWord('ca')).toBe(false)
      expect(trie.hasWord('carefu')).toBe(false)
    })
  })

  describe('hasPrefix', () => {
    it('finds valid prefixes', () => {
      expect(trie.hasPrefix('c')).toBe(true)
      expect(trie.hasPrefix('ca')).toBe(true)
      expect(trie.hasPrefix('car')).toBe(true)
      expect(trie.hasPrefix('care')).toBe(true)
      expect(trie.hasPrefix('d')).toBe(true)
      expect(trie.hasPrefix('do')).toBe(true)
    })

    it('returns false for invalid prefixes', () => {
      expect(trie.hasPrefix('x')).toBe(false)
      expect(trie.hasPrefix('caz')).toBe(false)
    })
  })

  describe('buildTrie', () => {
    it('builds trie from Set', () => {
      const words = new Set(['apple', 'app', 'banana'])
      const t = buildTrie(words)
      expect(t.hasWord('apple')).toBe(true)
      expect(t.hasWord('app')).toBe(true)
      expect(t.hasWord('banana')).toBe(true)
      expect(t.hasWord('ban')).toBe(false)
      expect(t.hasPrefix('ban')).toBe(true)
    })
  })
})
