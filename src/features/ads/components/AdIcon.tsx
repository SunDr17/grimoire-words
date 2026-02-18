import React from 'react'
import { StyleSheet, View } from 'react-native'

interface AdIconProps {
  readonly size?: number
  readonly color?: string
}

export function AdIcon({ size = 16, color = '#FFFFFF' }: AdIconProps) {
  const triangleSize = size * 0.4

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.triangle,
          {
            borderLeftWidth: triangleSize,
            borderTopWidth: triangleSize * 0.6,
            borderBottomWidth: triangleSize * 0.6,
            borderLeftColor: color,
            marginLeft: size * 0.1,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderStyle: 'solid',
  },
})
