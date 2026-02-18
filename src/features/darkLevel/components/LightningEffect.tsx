import React, { useEffect, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated'

interface LightningEffectProps {
  readonly enabled: boolean
  readonly onFlash?: () => void
}

export function LightningEffect({ enabled, onFlash }: LightningEffectProps) {
  const flashOpacity = useSharedValue(0)

  const triggerFlash = useCallback(() => {
    flashOpacity.value = withSequence(
      withTiming(0.7, { duration: 50 }),
      withTiming(0, { duration: 100 }),
      withTiming(0.3, { duration: 50 }),
      withTiming(0, { duration: 200 }),
    )
    onFlash?.()
  }, [flashOpacity, onFlash])

  useEffect(() => {
    if (!enabled) return

    const scheduleFlash = () => {
      const delay = 5000 + Math.random() * 10000
      const timeout = setTimeout(triggerFlash, delay)
      return timeout
    }

    let timeout = scheduleFlash()
    const interval = setInterval(() => {
      clearTimeout(timeout)
      timeout = scheduleFlash()
    }, 15000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
      cancelAnimation(flashOpacity)
    }
  }, [enabled, triggerFlash, flashOpacity])

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }))

  return (
    <Animated.View
      style={[styles.flash, flashStyle]}
      pointerEvents="none"
    />
  )
}

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 30,
  },
})
