import React from 'react'
import { StyleSheet, View } from 'react-native'

export function CRTEffect() {
  return <View style={styles.scanlines} pointerEvents="none" />
}

const styles = StyleSheet.create({
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 98,
    opacity: 0.05,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.3)',
    // Using repeating pattern via borderStyle
  },
})
