import { gameReducer, createInitialState } from '@/features/game/state/gameReducer'
import { getLevelConfig } from '@/features/game/utils/levelConfig'
import type { GameState } from '@/features/game/state/gameTypes'

function createPlayingState(): GameState {
  const config = getLevelConfig(1)
  const grid = [
    ['C', 'A', 'T', 'E', 'R', 'S'],
    ['R', 'A', 'C', 'E', 'D', 'I'],
    ['E', 'T', 'A', 'R', 'N', 'G'],
    ['S', 'I', 'N', 'G', 'O', 'L'],
    ['P', 'L', 'A', 'Y', 'E', 'R'],
    ['B', 'O', 'X', 'F', 'U', 'N'],
  ]
  const state = createInitialState(config, grid)
  return gameReducer(state, { type: 'START_GAME' })
}

describe('gameReducer', () => {
  describe('createInitialState', () => {
    it('creates state from level config', () => {
      const config = getLevelConfig(1)
      const grid = [
        ['A', 'B', 'C', 'D', 'E', 'F'],
        ['G', 'H', 'I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P', 'Q', 'R'],
        ['S', 'T', 'U', 'V', 'W', 'X'],
        ['Y', 'Z', 'A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H', 'I', 'J'],
      ]
      const state = createInitialState(config, grid)

      expect(state.levelId).toBe(1)
      expect(state.gridSize).toBe(6)
      expect(state.status).toBe('intro')
      expect(state.score).toBe(0)
      expect(state.foundWords).toHaveLength(0)
      expect(state.timeRemaining).toBe(config.timer)
    })
  })

  describe('SELECT_CELL', () => {
    it('selects first cell', () => {
      const state = createPlayingState()
      const next = gameReducer(state, {
        type: 'SELECT_CELL',
        position: { row: 0, col: 0 },
      })
      expect(next.selectedCells).toHaveLength(1)
      expect(next.currentWord).toBe('C')
    })

    it('selects adjacent cell', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 1 } })
      expect(state.selectedCells).toHaveLength(2)
      expect(state.currentWord).toBe('CA')
    })

    it('rejects non-adjacent cell', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 2, col: 2 } })
      expect(state.selectedCells).toHaveLength(1)
      expect(state.currentWord).toBe('C')
    })

    it('does not select when not playing', () => {
      const config = getLevelConfig(1)
      const grid = [
        ['A', 'B', 'C', 'D', 'E', 'F'],
        ['G', 'H', 'I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P', 'Q', 'R'],
        ['S', 'T', 'U', 'V', 'W', 'X'],
        ['Y', 'Z', 'A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H', 'I', 'J'],
      ]
      const state = createInitialState(config, grid)
      const next = gameReducer(state, {
        type: 'SELECT_CELL',
        position: { row: 0, col: 0 },
      })
      expect(next.selectedCells).toHaveLength(0)
    })

    it('does not reselect already selected cell', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      expect(state.selectedCells).toHaveLength(1)
    })

    it('supports backtracking by selecting previous cell', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 1 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 2 } })
      // Go back to col 1 (second-to-last)
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 1 } })
      expect(state.selectedCells).toHaveLength(2)
      expect(state.currentWord).toBe('CA')
    })
  })

  describe('SUBMIT_WORD', () => {
    it('adds word and updates score', () => {
      let state = createPlayingState()
      state = gameReducer(state, {
        type: 'SUBMIT_WORD',
        word: 'cat',
        path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      })
      expect(state.foundWords).toContain('cat')
      expect(state.score).toBeGreaterThan(0)
      expect(state.selectedCells).toHaveLength(0)
    })

    it('does not add duplicate words', () => {
      let state = createPlayingState()
      state = gameReducer(state, {
        type: 'SUBMIT_WORD',
        word: 'cat',
        path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      })
      const scoreAfterFirst = state.score
      state = gameReducer(state, {
        type: 'SUBMIT_WORD',
        word: 'cat',
        path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      })
      expect(state.foundWords.filter((w) => w === 'cat')).toHaveLength(1)
      expect(state.score).toBe(scoreAfterFirst)
    })

    it('tracks used letter positions', () => {
      let state = createPlayingState()
      state = gameReducer(state, {
        type: 'SUBMIT_WORD',
        word: 'cat',
        path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      })
      expect(state.usedLetterPositions.size).toBe(3)
    })
  })

  describe('TICK', () => {
    it('decrements timer', () => {
      const state = createPlayingState()
      const next = gameReducer(state, { type: 'TICK', delta: 1 })
      expect(next.timeRemaining).toBe(state.timeRemaining - 1)
    })

    it('sets status to lost when timer reaches 0', () => {
      let state = createPlayingState()
      state = { ...state, timeRemaining: 1 }
      const next = gameReducer(state, { type: 'TICK', delta: 1 })
      expect(next.timeRemaining).toBe(0)
      expect(next.status).toBe('lost')
    })

    it('does not tick when paused', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'PAUSE_GAME' })
      const next = gameReducer(state, { type: 'TICK', delta: 1 })
      expect(next.timeRemaining).toBe(state.timeRemaining)
    })
  })

  describe('power-ups', () => {
    it('decrements power-up count on use', () => {
      const state = createPlayingState()
      const next = gameReducer(state, { type: 'USE_POWER_UP', powerUp: 'scatterRune' })
      expect(next.powerUps.scatterRune).toBe(0)
      expect(next.powerUpsUsed).toBe(1)
    })

    it('does not use power-up with 0 count', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'USE_POWER_UP', powerUp: 'scatterRune' })
      const next = gameReducer(state, { type: 'USE_POWER_UP', powerUp: 'scatterRune' })
      expect(next.powerUps.scatterRune).toBe(0)
      expect(next.powerUpsUsed).toBe(1)
    })
  })

  describe('dark level mechanics', () => {
    it('hides and reveals cells', () => {
      const state = createPlayingState()
      let next = gameReducer(state, { type: 'HIDE_CELL', position: { row: 0, col: 0 } })
      expect(next.hiddenCells.has('0,0')).toBe(true)

      next = gameReducer(next, { type: 'REVEAL_CELL', position: { row: 0, col: 0 } })
      expect(next.hiddenCells.has('0,0')).toBe(false)
    })

    it('decays cells permanently', () => {
      const state = createPlayingState()
      const next = gameReducer(state, { type: 'DECAY_CELL', position: { row: 1, col: 1 } })
      expect(next.decayedCells.has('1,1')).toBe(true)
    })

    it('cannot select decayed cells', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'DECAY_CELL', position: { row: 0, col: 0 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      expect(state.selectedCells).toHaveLength(0)
    })

    it('cannot select hidden cells', () => {
      let state = createPlayingState()
      state = gameReducer(state, { type: 'HIDE_CELL', position: { row: 0, col: 0 } })
      state = gameReducer(state, { type: 'SELECT_CELL', position: { row: 0, col: 0 } })
      expect(state.selectedCells).toHaveLength(0)
    })

    it('handles doom clock time loss', () => {
      const state = createPlayingState()
      const next = gameReducer(state, { type: 'DOOM_TICK', timeLost: 5 })
      expect(next.timeRemaining).toBe(state.timeRemaining - 5)
    })
  })
})
