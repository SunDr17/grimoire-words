import type { PowerUpType } from '@/shared/types'

export interface DailyReward {
  readonly day: number
  readonly runes: readonly { readonly type: PowerUpType; readonly amount: number }[]
  readonly hp: number
}

export interface LoginRewardState {
  readonly currentDay: number
  readonly lastClaimDate: string | null
  readonly totalDaysClaimed: number
}

export function createDefaultLoginRewardState(): LoginRewardState {
  return {
    currentDay: 0,
    lastClaimDate: null,
    totalDaysClaimed: 0,
  }
}
