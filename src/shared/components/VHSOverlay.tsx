import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated'

export function VHSOverlay() {
  const lineY = useSharedValue(0)

  useEffect(() => {
    lineY.value = withRepeat(
      withSequence(
        withTiming(-100, { duration: 0 }),
        withTiming(800, { duration: 8000, easing: Easing.linear }),
      ),
      -1,
    )
    return () => {
      cancelAnimation(lineY)
    }
  }, [lineY])

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lineY.value }],
  }))

  return (
    <>
      <Animated.View style={[styles.trackingLine, lineStyle]} pointerEvents="none" />
      <Animated.View style={styles.filmGrain} pointerEvents="none" />
    </>
  )
}

const styles = StyleSheet.create({
  trackingLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 100,
  },
  filmGrain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.03,
    zIndex: 99,
  },
})
