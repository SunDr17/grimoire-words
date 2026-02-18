import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated'
import { COLORS, FONTS, FONT_SIZES } from '@/shared/constants'
import type { CellState } from '@/shared/types'

interface LetterCellProps {
  readonly letter: string
  readonly lightColor: string
  readonly cellSize: number
  readonly state: CellState
  readonly isDark?: boolean
  readonly isGolden?: boolean
}

export const LetterCell = React.memo(function LetterCell({
  letter,
  lightColor,
  cellSize,
  state,
  isDark = false,
  isGolden = false,
}: LetterCellProps) {
  const flickerValue = useSharedValue(0.6)
  const scaleValue = useSharedValue(1)
  const glowIntensity = useSharedValue(0)

  useEffect(() => {
    flickerValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 + Math.random() * 1000 }),
        withTiming(0.6, { duration: 1500 + Math.random() * 1000 }),
      ),
      -1,
      true,
    )
    return () => {
      cancelAnimation(flickerValue)
      cancelAnimation(scaleValue)
      cancelAnimation(glowIntensity)
    }
  }, [flickerValue, scaleValue, glowIntensity])

  useEffect(() => {
    if (state === 'hint') {
      scaleValue.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 12, stiffness: 200 }),
          withSpring(1.0, { damping: 12, stiffness: 200 }),
        ),
        -1,
        true,
      )
      glowIntensity.value = withTiming(1, { duration: 200 })
    } else if (state === 'selected') {
      scaleValue.value = withSpring(1.08, { damping: 15, stiffness: 200 })
      glowIntensity.value = withTiming(1, { duration: 150 })
    } else if (state === 'valid') {
      scaleValue.value = withSequence(
        withSpring(1.15, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 }),
      )
      glowIntensity.value = withTiming(1, { duration: 100 })
    } else if (state === 'invalid') {
      scaleValue.value = withSequence(
        withTiming(0.95, { duration: 50 }),
        withTiming(1.05, { duration: 50 }),
        withTiming(0.95, { duration: 50 }),
        withTiming(1, { duration: 50 }),
      )
      glowIntensity.value = withTiming(0, { duration: 200 })
    } else {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 200 })
      glowIntensity.value = withTiming(0, { duration: 200 })
    }
  }, [state, scaleValue, glowIntensity])

  const cellAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }))

  const bulbAnimStyle = useAnimatedStyle(() => {
    const isActive = glowIntensity.value > 0.5
    const opacity = isActive ? 1 : flickerValue.value

    return {
      opacity,
      backgroundColor: isActive ? lightColor : lightColor + '99',
      shadowColor: lightColor,
      shadowOpacity: isActive ? 0.9 : flickerValue.value * 0.4,
      shadowRadius: isActive ? 12 : 4,
    }
  })

  const letterColor = isDark ? COLORS.hollow.accent : COLORS.ui.textPrimary

  if (state === 'decayed') {
    return (
      <View style={[styles.cell, { width: cellSize, height: cellSize + 16 }]}>
        <View style={[styles.letterBox, styles.decayed, { width: cellSize, height: cellSize }]} />
        <View style={[styles.bulb, styles.bulbDead]} />
      </View>
    )
  }

  if (state === 'hidden') {
    return (
      <Animated.View style={[styles.cell, { width: cellSize, height: cellSize + 16 }, cellAnimStyle]}>
        <View style={[styles.letterBox, styles.hidden, { width: cellSize, height: cellSize }]}>
          <Text style={[styles.letter, { fontSize: cellSize * 0.5, color: COLORS.neon.red }]}>?</Text>
        </View>
        <Animated.View style={[styles.bulb, { backgroundColor: COLORS.neon.red + '66' }, bulbAnimStyle]} />
      </Animated.View>
    )
  }

  const goldenBorder = isGolden ? '#FFD700' : undefined

  return (
    <Animated.View style={[styles.cell, { width: cellSize, height: cellSize + 16 }, cellAnimStyle]}>
      <View
        style={[
          styles.letterBox,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: isDark ? '#0A0A0A' : COLORS.thornwall.wallpaper,
            borderColor: goldenBorder ?? (isDark ? COLORS.hollow.blood : COLORS.thornwall.wallpaperLight),
            borderWidth: isGolden ? 2.5 : 1.5,
          },
          isGolden && styles.goldenCell,
        ]}
      >
        <Text
          style={[
            styles.letter,
            {
              fontSize: cellSize * 0.5,
              color: state === 'hint' ? COLORS.neon.cyan : state === 'selected' ? COLORS.neon.red : letterColor,
            },
          ]}
        >
          {letter}
        </Text>
      </View>
      <Animated.View style={[styles.bulb, isGolden ? styles.goldenBulb : undefined, bulbAnimStyle]} />
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
  },
  letterBox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 4,
  },
  letter: {
    fontFamily: FONTS.title,
    fontWeight: '700',
    textAlign: 'center',
  },
  bulb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  bulbDead: {
    backgroundColor: '#333',
    shadowOpacity: 0,
  },
  decayed: {
    backgroundColor: '#0D0D0D',
    borderColor: '#1A1A1A',
    opacity: 0.3,
  },
  hidden: {
    backgroundColor: '#1A0000',
    borderColor: COLORS.neon.red + '44',
  },
  goldenCell: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  goldenBulb: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
  },
})
