import { useState, useEffect, useCallback } from 'react'
import { getLoginRewards, saveLoginRewards } from '@/persistence/storage'
import { usePowerUps } from '@/features/game/hooks/usePowerUps'
import { useHitPoints } from './useHitPoints'
import { getRewardForDay, getTodayDateString, canClaimToday } from '../utils/loginRewards'
import type { DailyReward, LoginRewardState } from '../types'
import { createDefaultLoginRewardState } from '../types'

export function useLoginRewards() {
  const [state, setState] = useState<LoginRewardState>(createDefaultLoginRewardState())
  const [canClaim, setCanClaim] = useState(false)
  const { grantPowerUp } = usePowerUps()
  const { restoreHP } = useHitPoints()

  useEffect(() => {
    getLoginRewards().then((saved) => {
      setState(saved)
      setCanClaim(canClaimToday(saved.lastClaimDate))
    })
  }, [])

  const currentDay = state.currentDay + 1
  const todayReward = getRewardForDay(currentDay)

  const claimReward = useCallback(async () => {
    const reward = getRewardForDay(currentDay)

    try {
      for (const rune of reward.runes) {
        await grantPowerUp(rune.type, rune.amount)
      }

      if (reward.hp > 0) {
        await restoreHP(reward.hp)
      }

      const newState: LoginRewardState = {
        currentDay: state.currentDay + 1,
        lastClaimDate: getTodayDateString(),
        totalDaysClaimed: state.totalDaysClaimed + 1,
      }

      await saveLoginRewards(newState)
      setState(newState)
      setCanClaim(false)
    } catch (error) {
      throw new Error(`Failed to claim login reward: ${String(error)}`)
    }
  }, [currentDay, state, grantPowerUp, restoreHP])

  return {
    canClaim,
    currentDay,
    todayReward,
    claimReward,
  }
}
