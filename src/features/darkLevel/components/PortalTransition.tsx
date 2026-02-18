import React, { useEffect } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { COLORS } from '@/shared/constants'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface PortalTransitionProps {
  readonly active: boolean
  readonly onComplete: () => void
}

export function PortalTransition({ active, onComplete }: PortalTransitionProps) {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const tearHeight = useSharedValue(0)

  useEffect(() => {
    if (!active) return

    opacity.value = withTiming(1, { duration: 200 })
    tearHeight.value = withTiming(SCREEN_HEIGHT, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    })
    scale.value = withSequence(
      withTiming(1.5, { duration: 800, easing: Easing.out(Easing.cubic) }),
      withDelay(200, withTiming(0, { duration: 400 })),
    )

    const timer = setTimeout(onComplete, 1200)
    return () => clearTimeout(timer)
  }, [active, scale, opacity, tearHeight, onComplete])

  const portalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const tearStyle = useAnimatedStyle(() => ({
    height: tearHeight.value,
  }))

  if (!active) return null

  return (
    <>
      <Animated.View style={[styles.overlay, portalStyle]}>
        <Animated.View style={[styles.tear, tearStyle]} />
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 100,
  },
  tear: {
    width: 4,
    backgroundColor: COLORS.neon.red,
    shadowColor: COLORS.neon.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
})
