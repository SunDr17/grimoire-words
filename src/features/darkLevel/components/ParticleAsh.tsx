import React, { useEffect } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const PARTICLE_COUNT = 20

function Particle({ index }: { readonly index: number }) {
  const x = useSharedValue(Math.random() * SCREEN_WIDTH)
  const y = useSharedValue(-20 - Math.random() * 100)
  const opacity = useSharedValue(0)
  const size = 2 + Math.random() * 3

  useEffect(() => {
    const duration = 6000 + Math.random() * 4000
    const delay = index * 300

    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_HEIGHT + 20, { duration, easing: Easing.linear }),
        -1,
      ),
    )

    x.value = withDelay(
      delay,
      withRepeat(
        withTiming(
          x.value + (Math.random() - 0.5) * 100,
          { duration: duration / 2, easing: Easing.inOut(Easing.sin) },
        ),
        -1,
        true,
      ),
    )

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, { duration: 2000 }),
        -1,
        true,
      ),
    )

    return () => {
      cancelAnimation(x)
      cancelAnimation(y)
      cancelAnimation(opacity)
    }
  }, [index, x, y, opacity])

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: x.value,
    top: y.value,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#888',
    opacity: opacity.value,
  }))

  return <Animated.View style={style} />
}

export function ParticleAsh() {
  return (
    <>
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <Particle key={i} index={i} />
      ))}
    </>
  )
}
