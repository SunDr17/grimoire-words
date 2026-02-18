import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import type { Feat } from '@/features/retention/utils/feats'

interface FeatBadgeProps {
  readonly feat: Feat
  readonly earned: boolean
}

function ShieldIcon({ earned }: { readonly earned: boolean }) {
  const color = earned ? COLORS.thornwall.secondary : '#555544'
  return (
    <View style={shieldStyles.container}>
      <View style={[shieldStyles.top, { backgroundColor: color }]} />
      <View style={[shieldStyles.bottom, { borderTopColor: color }]} />
    </View>
  )
}

export function FeatBadge({ feat, earned }: FeatBadgeProps) {
  return (
    <View style={[styles.container, !earned && styles.locked]}>
      <View style={[styles.shield, earned && styles.shieldEarned]}>
        <ShieldIcon earned={earned} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, earned && styles.nameEarned]}>
          {feat.name}
        </Text>
        <Text style={styles.description}>{feat.description}</Text>
      </View>
    </View>
  )
}

const shieldStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 18,
    height: 22,
  },
  top: {
    width: 18,
    height: 12,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  bottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.grimoire.primary + '88',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '22',
    gap: SPACING.md,
  },
  locked: {
    opacity: 0.5,
  },
  shield: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldEarned: {
    backgroundColor: COLORS.grimoire.secondary + '44',
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    fontWeight: '700',
  },
  nameEarned: {
    color: COLORS.grimoire.parchment,
  },
  description: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textDim,
    marginTop: 2,
  },
})
