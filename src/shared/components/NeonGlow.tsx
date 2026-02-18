import React from 'react'
import { View, type ViewStyle, type StyleProp } from 'react-native'

interface NeonGlowProps {
  readonly children: React.ReactNode
  readonly color: string
  readonly intensity?: number
  readonly style?: StyleProp<ViewStyle>
}

export function NeonGlow({
  children,
  color,
  intensity = 10,
  style,
}: NeonGlowProps) {
  return (
    <View
      style={[
        {
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: intensity,
          elevation: intensity,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
