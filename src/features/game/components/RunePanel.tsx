import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import type { PowerUpType } from '@/shared/types'
import { NeonGlow } from '@/shared/components'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

interface RunePanelProps {
  readonly powerUps: Record<PowerUpType, number>
  readonly onUsePower: (power: PowerUpType) => void
  readonly enabled: boolean
}

const POWER_COLORS: Record<PowerUpType, string> = {
  scatterRune: COLORS.neon.purple,
  sightRune: COLORS.neon.cyan,
  stasisRune: COLORS.neon.blue,
}

const POWER_KEYS: readonly PowerUpType[] = ['scatterRune', 'sightRune', 'stasisRune']

function PowerIcon({ power, color }: { power: PowerUpType; color: string }) {
  const size = 22
  switch (power) {
    case 'scatterRune':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8 2 5 5 5 9c0 2.5 1.2 4.7 3 6v3c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-3c1.8-1.3 3-3.5 3-6 0-4-3-7-7-7z"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M9 21h6M10 17v1M14 17v1" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M12 6v4M10 8h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      )
    case 'sightRune':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={12} r={3.5} stroke={color} strokeWidth={1.5} />
          <Circle cx={12} cy={12} r={1} fill={color} />
        </Svg>
      )
    case 'stasisRune':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.5} />
          <Path d="M12 6v6l4 2" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4 4l2 2M20 4l-2 2" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
        </Svg>
      )
  }
}

export function RunePanel({
  powerUps,
  onUsePower,
  enabled,
}: RunePanelProps) {
  const { t } = useLanguage()
  return (
    <View style={styles.container}>
      <View style={styles.powers}>
        {POWER_KEYS.map((power) => {
          const color = POWER_COLORS[power]
          const label = t(`power.${power}`)
          const count = powerUps[power]
          const available = count > 0 && enabled

          return (
            <TouchableOpacity
              key={power}
              style={[styles.powerButton, !available && styles.powerDisabled]}
              onPress={() => available && onUsePower(power)}
              disabled={!available}
              activeOpacity={0.7}
            >
              <NeonGlow color={available ? color : '#333'} intensity={available ? 8 : 0}>
                <View style={[styles.powerOrb, { borderColor: color + (available ? 'CC' : '33') }]}>
                  <PowerIcon power={power} color={available ? color : '#555'} />
                </View>
              </NeonGlow>
              <Text style={[styles.powerLabel, { color: available ? color : '#555' }]}>
                {label}
              </Text>
              {count > 0 && (
                <Text style={styles.countBadge}>{count}</Text>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  powers: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  powerButton: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  powerDisabled: {
    opacity: 0.4,
  },
  powerOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.white,
    backgroundColor: COLORS.neon.red,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
    overflow: 'hidden',
  },
})
