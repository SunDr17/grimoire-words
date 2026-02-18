import React from 'react'
import { Text, type TextStyle, type StyleProp } from 'react-native'
import { COLORS, FONTS } from '@/shared/constants'

interface RuneTextProps {
  readonly children: React.ReactNode
  readonly style?: StyleProp<TextStyle>
  readonly size?: number
  readonly color?: string
  readonly glow?: boolean
  readonly numberOfLines?: number
  readonly adjustsFontSizeToFit?: boolean
}

export function RuneText({
  children,
  style,
  size = 32,
  color = COLORS.neon.red,
  glow = true,
  numberOfLines,
  adjustsFontSizeToFit,
}: RuneTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      style={[
        {
          fontFamily: FONTS.title,
          fontSize: size,
          color,
          textTransform: 'uppercase',
          letterSpacing: 2,
          textAlign: 'center',
        },
        glow && {
          textShadowColor: color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
