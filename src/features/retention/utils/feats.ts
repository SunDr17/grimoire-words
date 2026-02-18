import type { PlayerStats } from '@/persistence/types'

export interface Feat {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly check: (stats: PlayerStats) => boolean
}

export const FEATS: readonly Feat[] = [
  {
    id: 'inkwell',
    name: 'Inkwell',
    description: 'Find 50 total words',
    icon: 'scroll',
    check: (s) => s.totalWordsFound >= 50,
  },
  {
    id: 'lexicon_keeper',
    name: 'Lexicon Keeper',
    description: 'Find 500 total words',
    icon: 'book',
    check: (s) => s.totalWordsFound >= 500,
  },
  {
    id: 'shadow_breaker',
    name: 'Shadow Breaker',
    description: 'Defeat your first boss',
    icon: 'sword',
    check: (s) => s.monstersDefeated >= 1,
  },
  {
    id: 'bane_of_the_hollow',
    name: 'Bane of the Hollow',
    description: 'Defeat 5 bosses',
    icon: 'shield',
    check: (s) => s.monstersDefeated >= 5,
  },
  {
    id: 'oath_keeper',
    name: 'Oath Keeper',
    description: '7-day streak',
    icon: 'heart',
    check: (s) => s.bestStreak >= 7,
  },
  {
    id: 'page_turner',
    name: 'Page Turner',
    description: 'Play 10 games',
    icon: 'skull',
    check: (s) => s.gamesPlayed >= 10,
  },
  {
    id: 'golden_quill',
    name: 'Golden Quill',
    description: 'Earn 10,000 total points',
    icon: 'crown',
    check: (s) => s.totalScore >= 10000,
  },
  {
    id: 'chronicler',
    name: 'Chronicler',
    description: 'Play 50 games',
    icon: 'medal',
    check: (s) => s.gamesPlayed >= 50,
  },
]

export function getEarnedFeats(stats: PlayerStats): readonly Feat[] {
  return FEATS.filter((feat) => feat.check(stats))
}

export function getNextFeat(stats: PlayerStats): Feat | null {
  return FEATS.find((feat) => !feat.check(stats)) ?? null
}
