import React, { useEffect } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

function FogPatch({ delay, yPos }: { readonly delay: number; readonly yPos: number }) {
  const translateX = useSharedValue(-200)
  const opacity = useSharedValue(0)

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-200, { duration: 0 }),
        withTiming(SCREEN_WIDTH + 200, {
          duration: 12000 + delay * 2000,
          easing: Easing.linear,
        }),
      ),
      -1,
    )

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 3000 }),
        withTiming(0.05, { duration: 3000 }),
      ),
      -1,
      true,
    )

    return () => {
      cancelAnimation(translateX)
      cancelAnimation(opacity)
    }
  }, [delay, translateX, opacity])

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.fog,
        { top: yPos },
        style,
      ]}
      pointerEvents="none"
    />
  )
}

export function FogOverlay() {
  return (
    <>
      <FogPatch delay={0} yPos={200} />
      <FogPatch delay={1} yPos={400} />
      <FogPatch delay={2} yPos={550} />
    </>
  )
}

const styles = StyleSheet.create({
  fog: {
    position: 'absolute',
    width: 300,
    height: 80,
    backgroundColor: '#666',
    borderRadius: 40,
    zIndex: 20,
  },
})
