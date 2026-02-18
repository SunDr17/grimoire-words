import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { RuneText } from '@/shared/components'
import { COLORS } from '@/shared/constants'

interface WordPreviewProps {
  readonly currentWord: string
  readonly isDark?: boolean
}

export function WordPreview({ currentWord, isDark = false }: WordPreviewProps) {
  const scale = useSharedValue(1)

  useEffect(() => {
    if (currentWord.length > 0) {
      scale.value = withSpring(1.05, { damping: 15, stiffness: 200 })
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 })
    }
  }, [currentWord, scale])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const color = isDark ? COLORS.hollow.accent : COLORS.neon.red

  return (
    <View style={styles.container}>
      <Animated.View style={animStyle}>
        <RuneText size={28} color={color} glow>
          {currentWord || '\u00A0'}
        </RuneText>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
