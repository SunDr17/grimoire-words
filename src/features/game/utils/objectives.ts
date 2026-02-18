import type { ObjectiveType, Objective, BonusObjective, Language } from '@/shared/types'
import { translate } from '@/shared/i18n/translations'

export interface ObjectiveProgress {
  readonly current: number
  readonly target: number
  readonly label: string
  readonly complete: boolean
}

export interface GameStateForObjective {
  readonly score: number
  readonly foundWords: readonly string[]
  readonly usedLetters: ReadonlySet<string>
  readonly timeRemaining: number
  readonly powerUpsUsed: number
  readonly totalLetters: number
}

export function checkObjectiveComplete(
  state: GameStateForObjective,
  objective: Objective,
): boolean {
  return getObjectiveProgress(state, objective).complete
}

export function getObjectiveProgress(
  state: GameStateForObjective,
  objective: Objective,
  language: Language = 'en',
): ObjectiveProgress {
  switch (objective.type) {
    case 'scoreTarget':
      return {
        current: state.score,
        target: objective.target,
        label: translate(language, 'objective.scoreTarget', { target: objective.target }),
        complete: state.score >= objective.target,
      }

    case 'wordHunter':
      return {
        current: state.foundWords.length,
        target: objective.target,
        label: translate(language, 'objective.wordHunter', { target: objective.target }),
        complete: state.foundWords.length >= objective.target,
      }

    case 'linguist': {
      const longWords = state.foundWords.filter((w) => w.length >= 5).length
      return {
        current: longWords,
        target: objective.target,
        label: translate(language, 'objective.linguist', { target: objective.target }),
        complete: longWords >= objective.target,
      }
    }

    case 'wordsmith': {
      const maxLen = state.foundWords.reduce(
        (max, w) => Math.max(max, w.length),
        0,
      )
      return {
        current: maxLen,
        target: objective.target,
        label: translate(language, 'objective.wordsmith', { target: objective.target }),
        complete: maxLen >= objective.target,
      }
    }

    case 'clearTheWall':
      return {
        current: state.usedLetters.size,
        target: state.totalLetters,
        label: translate(language, 'objective.clearTheWall'),
        complete: state.usedLetters.size >= state.totalLetters,
      }

    case 'speedRun': {
      const wordsFound = state.foundWords.length
      const hasEnoughTime = state.timeRemaining > 30
      return {
        current: wordsFound,
        target: objective.target,
        label: translate(language, 'objective.speedRun', { target: objective.target }),
        complete: wordsFound >= objective.target && hasEnoughTime,
      }
    }
  }
}

export function checkBonusComplete(
  state: GameStateForObjective,
  bonus: BonusObjective,
): boolean {
  switch (bonus.type) {
    case 'longWord':
      return state.foundWords.some((w) => w.length >= bonus.target)
    case 'highScore':
      return state.score >= bonus.target
    case 'timeRemaining':
      return state.timeRemaining >= bonus.target
    case 'noPowerUps':
      return state.powerUpsUsed === 0
    default:
      return false
  }
}

export function createObjective(
  type: ObjectiveType,
  target: number,
  language: Language = 'en',
): Objective {
  const translationKeys: Record<ObjectiveType, string> = {
    scoreTarget: 'objective.scoreTarget',
    wordHunter: 'objective.wordHunter',
    linguist: 'objective.linguist',
    wordsmith: 'objective.wordsmith',
    clearTheWall: 'objective.clearTheWall',
    speedRun: 'objective.speedRun',
  }

  return {
    type,
    target,
    label: translate(language, translationKeys[type], { target }),
  }
}

export function createBonusLabel(
  type: string,
  target: number,
  language: Language = 'en',
): string {
  const translationKeys: Record<string, string> = {
    longWord: 'bonus.longWord',
    highScore: 'bonus.highScore',
    timeRemaining: 'bonus.timeRemaining',
    noPowerUps: 'bonus.noPowerUps',
  }

  const key = translationKeys[type]
  if (!key) return type
  return translate(language, key, { target })
}
