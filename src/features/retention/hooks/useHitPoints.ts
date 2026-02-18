import { useState, useEffect, useCallback } from 'react'
import { getInventory, saveInventory } from '@/persistence/storage'

const MAX_HP = 5
export const REGEN_INTERVAL_MS = 30 * 60 * 1000

export function useHitPoints() {
  const [hp, setHp] = useState(MAX_HP)
  const [lastHpRegen, setLastHpRegen] = useState(Date.now())

  const reload = useCallback(async () => {
    const inv = await getInventory()
    const now = Date.now()
    const elapsed = now - inv.lastHpRegen
    const regenCount = Math.floor(elapsed / REGEN_INTERVAL_MS)
    const newHp = Math.min(MAX_HP, inv.hitPoints + regenCount)

    if (newHp !== inv.hitPoints) {
      const updated = {
        ...inv,
        hitPoints: newHp,
        lastHpRegen: inv.lastHpRegen + regenCount * REGEN_INTERVAL_MS,
      }
      await saveInventory(updated)
      setLastHpRegen(updated.lastHpRegen)
    } else {
      setLastHpRegen(inv.lastHpRegen)
    }

    setHp(newHp)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const spendHP = useCallback(async () => {
    if (hp <= 0) return false

    const inv = await getInventory()
    if (inv.hitPoints <= 0) return false

    const updated = { ...inv, hitPoints: inv.hitPoints - 1 }
    await saveInventory(updated)
    setHp(updated.hitPoints)
    return true
  }, [hp])

  const restoreHP = useCallback(async (amount: number) => {
    const inv = await getInventory()
    const newHp = Math.min(MAX_HP, inv.hitPoints + amount)
    const updated = { ...inv, hitPoints: newHp }
    await saveInventory(updated)
    setHp(newHp)
  }, [])

  return { hp, maxHp: MAX_HP, lastHpRegen, spendHP, restoreHP, reload }
}
