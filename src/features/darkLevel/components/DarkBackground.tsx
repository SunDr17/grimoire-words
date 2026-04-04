import React from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const DARK_IMAGES: Record<number, ReturnType<typeof require>> = {
  1: require('../../../../assets/images/dark-levels/dark-bg-1.webp'),
  2: require('../../../../assets/images/dark-levels/dark-bg-2.webp'),
  3: require('../../../../assets/images/dark-levels/dark-bg-3.webp'),
  4: require('../../../../assets/images/dark-levels/dark-bg-4.webp'),
  5: require('../../../../assets/images/dark-levels/dark-bg-5.webp'),
}

interface DarkBackgroundProps {
  readonly imageIndex: number
  readonly children: React.ReactNode
}

export function DarkBackground({ imageIndex, children }: DarkBackgroundProps) {
  const source = DARK_IMAGES[imageIndex] ?? DARK_IMAGES[1]

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.40)', 'rgba(0,0,0,0.25)']}
        style={styles.overlay}
      />
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
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
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
  },
})
