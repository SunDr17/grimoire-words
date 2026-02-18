import { useCallback } from 'react'
import type { PowerUpType } from '@/shared/types'
import { getInventory, saveInventory } from '@/persistence/storage'

export function usePowerUps() {
  const loadInventory = useCallback(async () => {
    const inv = await getInventory()
    return {
      scatterRune: inv.scatterRune,
      sightRune: inv.sightRune,
      stasisRune: inv.stasisRune,
    }
  }, [])

  const spendPowerUp = useCallback(async (type: PowerUpType) => {
    const inv = await getInventory()
    const current = inv[type]
    if (current <= 0) return false

    const updated = { ...inv, [type]: current - 1 }
    await saveInventory(updated)
    return true
  }, [])

  const grantPowerUp = useCallback(async (type: PowerUpType, amount: number = 1) => {
    const inv = await getInventory()
    const updated = { ...inv, [type]: inv[type] + amount }
    await saveInventory(updated)
  }, [])

  return { loadInventory, spendPowerUp, grantPowerUp }
}
