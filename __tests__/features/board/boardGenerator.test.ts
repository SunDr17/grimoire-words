import { generateBoard, lettersToGrid } from '@/features/board/utils/boardGenerator'
import { buildTrie } from '@/features/words/utils/trie'
import { loadDictionary } from '@/features/words/utils/dictionary'

const testWordList = [
  'cat', 'car', 'care', 'are', 'ace', 'arc', 'ear', 'era', 'tar',
  'rat', 'art', 'eat', 'ate', 'tea', 'rate', 'tear', 'race', 'crate',
  'trace', 'star', 'stare', 'stone', 'tone', 'note', 'nose', 'rose',
  'rest', 'nest', 'test', 'best', 'vest', 'west', 'last', 'list',
  'lost', 'most', 'host', 'mine', 'line', 'vine', 'wine', 'dine',
  'fine', 'nine', 'pine', 'tire', 'fire', 'hire', 'wire', 'dire',
  'rain', 'main', 'gain', 'pain', 'lane', 'cane', 'sane', 'mane',
  'trail', 'train', 'grain', 'brain', 'drain', 'stain', 'saint',
  'night', 'light', 'sight', 'might', 'right', 'fight', 'tight',
  'dream', 'cream', 'steam', 'stream', 'master', 'listen', 'silent',
  'mental', 'rental', 'detail', 'retain', 'remain', 'dinner', 'winter',
  'sister', 'reason', 'season', 'lesson', 'person', 'simple', 'single',
  'strange', 'monster', 'mineral', 'eastern', 'destiny', 'distant',
  'masters', 'storing', 'resting', 'listing', 'toaster', 'roasted',
  'nastier', 'sardine', 'instead', 'detains', 'trained', 'stainer',
  'real', 'deal', 'meal', 'seal', 'heal', 'tale', 'sale', 'male',
  'role', 'sole', 'pole', 'mole', 'hole', 'home', 'some', 'come',
  'done', 'gone', 'bone', 'tone', 'lone', 'zone', 'more', 'core',
  'bore', 'lore', 'sore', 'wore', 'torn', 'horn', 'born', 'corn',
  'rent', 'sent', 'dent', 'tent', 'vent', 'went', 'lent', 'bent',
  'rise', 'wise', 'size', 'hand', 'land', 'sand', 'band', 'wind',
  'mind', 'find', 'kind', 'salt', 'mist', 'dust', 'dark', 'time',
  'ring', 'sing', 'king', 'sting', 'thing', 'bring', 'swing', 'string',
  'liner', 'miner', 'diner', 'shine', 'risen', 'lemon',
  'flame', 'water', 'steal', 'lines', 'rains', 'tones', 'notes',
]

describe('boardGenerator', () => {
  let trie: ReturnType<typeof buildTrie>

  beforeAll(() => {
    const wordSet = loadDictionary(testWordList, 'en')
    trie = buildTrie(wordSet)
  })

  describe('generateBoard', () => {
    it('generates a 6x6 board with correct dimensions', () => {
      const board = generateBoard(6, trie, 100, 3, 'en')

      expect(board.gridSize).toBe(6)
      expect(board.grid.length).toBe(6)
      for (const row of board.grid) {
        expect(row.length).toBe(6)
      }
    })

    it('all grid cells contain uppercase letters', () => {
      const board = generateBoard(6, trie, 100, 3, 'en')

      for (const row of board.grid) {
        for (const cell of row) {
          expect(cell).toMatch(/^[A-Z]$/)
        }
      }
    })

    it('generates a board with findable words', () => {
      const board = generateBoard(6, trie, 100, 3, 'en')
      expect(board.solution.words.size).toBeGreaterThan(0)
    })

    it('generates a 4x4 board successfully', () => {
      const board = generateBoard(4, trie, 50, 3, 'en')

      expect(board.gridSize).toBe(4)
      expect(board.grid.length).toBe(4)
      expect(board.solution.words.size).toBeGreaterThan(0)
    })

    it('returns a valid solution with score', () => {
      const board = generateBoard(6, trie, 100, 3, 'en')
      expect(board.solution.totalScore).toBeGreaterThan(0)
    })
  })

  describe('lettersToGrid', () => {
    it('converts flat letter array to 2D grid', () => {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
      const grid = lettersToGrid(letters, 3)

      expect(grid).toEqual([
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I'],
      ])
    })

    it('handles 4x4 grid correctly', () => {
      const letters = Array.from({ length: 16 }, (_, i) =>
        String.fromCharCode(65 + i),
      )
      const grid = lettersToGrid(letters, 4)

      expect(grid.length).toBe(4)
      expect(grid[0]).toEqual(['A', 'B', 'C', 'D'])
      expect(grid[3]).toEqual(['M', 'N', 'O', 'P'])
    })
  })
})
