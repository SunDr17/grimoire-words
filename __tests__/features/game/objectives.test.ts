import {
  checkObjectiveComplete,
  getObjectiveProgress,
  checkBonusComplete,
  createObjective,
  type GameStateForObjective,
} from '@/features/game/utils/objectives'

function createTestState(overrides: Partial<GameStateForObjective> = {}): GameStateForObjective {
  return {
    score: 0,
    foundWords: [],
    usedLetters: new Set(),
    timeRemaining: 60,
    powerUpsUsed: 0,
    totalLetters: 16,
    ...overrides,
  }
}

describe('objectives', () => {
  describe('scoreTarget', () => {
    const objective = createObjective('scoreTarget', 200)

    it('is not complete when score is below target', () => {
      const state = createTestState({ score: 150 })
      expect(checkObjectiveComplete(state, objective)).toBe(false)
    })

    it('is complete when score meets target', () => {
      const state = createTestState({ score: 200 })
      expect(checkObjectiveComplete(state, objective)).toBe(true)
    })

    it('tracks progress correctly', () => {
      const state = createTestState({ score: 100 })
      const progress = getObjectiveProgress(state, objective)
      expect(progress.current).toBe(100)
      expect(progress.target).toBe(200)
      expect(progress.complete).toBe(false)
    })
  })

  describe('wordHunter', () => {
    const objective = createObjective('wordHunter', 5)

    it('tracks word count', () => {
      const state = createTestState({
        foundWords: ['cat', 'dog', 'rat'],
      })
      const progress = getObjectiveProgress(state, objective)
      expect(progress.current).toBe(3)
      expect(progress.target).toBe(5)
      expect(progress.complete).toBe(false)
    })

    it('completes when enough words found', () => {
      const state = createTestState({
        foundWords: ['cat', 'dog', 'rat', 'bat', 'hat'],
      })
      expect(checkObjectiveComplete(state, objective)).toBe(true)
    })
  })

  describe('linguist', () => {
    const objective = createObjective('linguist', 3)

    it('counts only words with 5+ letters', () => {
      const state = createTestState({
        foundWords: ['cat', 'trace', 'crate', 'dog', 'rates'],
      })
      const progress = getObjectiveProgress(state, objective)
      expect(progress.current).toBe(3)
      expect(progress.complete).toBe(true)
    })
  })

  describe('wordsmith', () => {
    const objective = createObjective('wordsmith', 7)

    it('tracks longest word length', () => {
      const state = createTestState({
        foundWords: ['cat', 'trace', 'craters'],
      })
      const progress = getObjectiveProgress(state, objective)
      expect(progress.current).toBe(7)
      expect(progress.complete).toBe(true)
    })

    it('is not complete without long enough word', () => {
      const state = createTestState({
        foundWords: ['cat', 'trace'],
      })
      expect(checkObjectiveComplete(state, objective)).toBe(false)
    })
  })

  describe('clearTheWall', () => {
    const objective = createObjective('clearTheWall', 16)

    it('tracks used letter positions', () => {
      const used = new Set(['0,0', '0,1', '1,0', '1,1'])
      const state = createTestState({ usedLetters: used, totalLetters: 16 })
      const progress = getObjectiveProgress(state, objective)
      expect(progress.current).toBe(4)
      expect(progress.complete).toBe(false)
    })
  })

  describe('bonusObjectives', () => {
    it('checks longWord bonus', () => {
      const state = createTestState({ foundWords: ['crate', 'craters'] })
      expect(checkBonusComplete(state, { type: 'longWord', target: 6, label: '' })).toBe(true)
    })

    it('checks highScore bonus', () => {
      const state = createTestState({ score: 500 })
      expect(checkBonusComplete(state, { type: 'highScore', target: 400, label: '' })).toBe(true)
    })

    it('checks noPowerUps bonus', () => {
      const state = createTestState({ powerUpsUsed: 0 })
      expect(checkBonusComplete(state, { type: 'noPowerUps', target: 0, label: '' })).toBe(true)
    })
  })
})
