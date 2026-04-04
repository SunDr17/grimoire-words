import React from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const LIGHT_IMAGES: Record<number, ReturnType<typeof require>> = {
  1: require('../../../../assets/images/light-levels/light-bg-1.jpg'),
  2: require('../../../../assets/images/light-levels/light-bg-2.jpg'),
  3: require('../../../../assets/images/light-levels/light-bg-3.jpg'),
  4: require('../../../../assets/images/light-levels/light-bg-4.jpg'),
  5: require('../../../../assets/images/light-levels/light-bg-5.jpg'),
  6: require('../../../../assets/images/light-levels/light-bg-6.jpg'),
  7: require('../../../../assets/images/light-levels/light-bg-7.jpg'),
}

const IMAGE_COUNT = Object.keys(LIGHT_IMAGES).length

interface LightBackgroundProps {
  readonly levelId: number
  readonly children: React.ReactNode
}

export function LightBackground({ levelId, children }: LightBackgroundProps) {
  const imageIndex = ((levelId - 1) % IMAGE_COUNT) + 1
  const source = LIGHT_IMAGES[imageIndex] ?? LIGHT_IMAGES[1]

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.30)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.20)', 'rgba(0,0,0,0.35)']}
        style={styles.overlay}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
})
