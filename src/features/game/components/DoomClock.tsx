import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { COLORS, FONTS, FONT_SIZES } from '@/shared/constants'

interface DoomClockProps {
  readonly timeRemaining: number
  readonly maxTime: number
  readonly frozen?: boolean
}

export function DoomClock({ timeRemaining, maxTime, frozen = false }: DoomClockProps) {
  const pulseScale = useSharedValue(1)
  const isWarning = timeRemaining <= 10

  useEffect(() => {
    if (isWarning) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 300 }),
          withTiming(1, { duration: 300 }),
        ),
        -1,
      )
    } else {
      pulseScale.value = 1
    }
  }, [isWarning, pulseScale])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }))

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const color = frozen
    ? COLORS.neon.cyan
    : isWarning
      ? COLORS.neon.red
      : COLORS.ui.textPrimary

  return (
    <Animated.View style={[styles.container, pulseStyle]}>
      <Text style={[styles.clockIcon, { color }]}>{'⏱'}</Text>
      <Text style={[styles.time, { color }]}>{timeStr}</Text>
      {frozen && <Text style={styles.frozenLabel}>FROZEN</Text>}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockIcon: {
    fontSize: FONT_SIZES.md,
  },
  time: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  frozenLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.neon.cyan,
    marginLeft: 2,
  },
})
