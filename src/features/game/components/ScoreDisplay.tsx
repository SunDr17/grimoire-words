import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { RuneText } from '@/shared/components'
import { COLORS, FONTS, FONT_SIZES } from '@/shared/constants'

interface ScoreDisplayProps {
  readonly score: number
  readonly lastWordScore?: number
}

export function ScoreDisplay({ score, lastWordScore }: ScoreDisplayProps) {
  const popScale = useSharedValue(0)
  const popOpacity = useSharedValue(0)
  const popY = useSharedValue(0)
  const [displayedBonus, setDisplayedBonus] = useState(0)

  useEffect(() => {
    if (lastWordScore && lastWordScore > 0) {
      setDisplayedBonus(lastWordScore)
      popScale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withTiming(1, { duration: 200 }),
      )
      popOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 800 }),
      )
      popY.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-30, { duration: 900 }),
      )
    }
  }, [lastWordScore, popScale, popOpacity, popY])

  const bonusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popScale.value }, { translateY: popY.value }],
    opacity: popOpacity.value,
  }))

  return (
    <View style={styles.container}>
      <RuneText size={FONT_SIZES.xxl} color={COLORS.thornwall.secondary}>
        {score}
      </RuneText>
      <Animated.Text style={[styles.bonus, bonusStyle]}>
        +{displayedBonus}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonus: {
    position: 'absolute',
    top: -10,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neon.green,
    fontWeight: '700',
  },
})
