import type { DailyReward } from '../types'

const REWARD_SCHEDULE: readonly DailyReward[] = [
  {
    day: 1,
    runes: [{ type: 'scatterRune', amount: 1 }],
    hp: 0,
  },
  {
    day: 2,
    runes: [{ type: 'sightRune', amount: 1 }],
    hp: 1,
  },
  {
    day: 3,
    runes: [{ type: 'stasisRune', amount: 1 }],
    hp: 0,
  },
  {
    day: 4,
    runes: [
      { type: 'scatterRune', amount: 1 },
      { type: 'sightRune', amount: 1 },
    ],
    hp: 1,
  },
  {
    day: 5,
    runes: [{ type: 'stasisRune', amount: 2 }],
    hp: 0,
  },
  {
    day: 6,
    runes: [
      { type: 'scatterRune', amount: 1 },
      { type: 'sightRune', amount: 1 },
      { type: 'stasisRune', amount: 1 },
    ],
    hp: 2,
  },
  {
    day: 7,
    runes: [
      { type: 'scatterRune', amount: 2 },
      { type: 'sightRune', amount: 2 },
      { type: 'stasisRune', amount: 2 },
    ],
    hp: 5,
  },
]

export function getRewardForDay(day: number): DailyReward {
  const cycleDay = ((day - 1) % 7) + 1
  return REWARD_SCHEDULE[cycleDay - 1]
}

export function getTodayDateString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function canClaimToday(lastClaimDate: string | null): boolean {
  if (lastClaimDate === null) return true
  return lastClaimDate !== getTodayDateString()
}
