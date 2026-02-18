import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'

interface CampaignDaysProps {
  readonly streak: number
}

export function CampaignDays({ streak }: CampaignDaysProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Campaign Day</Text>
      <Text style={styles.value}>{streak}</Text>
      <Text style={styles.subtitle}>
        {streak === 0 ? 'Start your adventure!' : `${streak} day${streak !== 1 ? 's' : ''} strong`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.grimoire.primary + 'AA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '33',
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.grimoire.secondary,
    letterSpacing: 2,
  },
  value: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.title,
    color: COLORS.grimoire.parchment,
    marginVertical: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textDim,
  },
})
