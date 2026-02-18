import { useEffect, useRef } from 'react'

interface UseDoomClockProps {
  readonly enabled: boolean
  readonly onTimeLost: (seconds: number) => void
}

export function useDoomClock({ enabled, onTimeLost }: UseDoomClockProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(() => {
      const timeLost = 3 + Math.floor(Math.random() * 5)
      onTimeLost(timeLost)
    }, 15000 + Math.random() * 10000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, onTimeLost])
}
