import React, { useCallback, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { useAds } from '@/features/ads/hooks/useAds'
import { usePowerUps } from '@/features/game/hooks/usePowerUps'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import type { PowerUpType } from '@/shared/types'
import { AdIcon } from './AdIcon'

const RUNE_TYPES: readonly PowerUpType[] = ['scatterRune', 'sightRune', 'stasisRune']

const RUNE_COLORS: Record<PowerUpType, string> = {
  scatterRune: COLORS.neon.purple,
  sightRune: COLORS.neon.cyan,
  stasisRune: COLORS.neon.blue,
}

export function BonusRuneButton() {
  const { rewardedReady, tryShowRewarded } = useAds()
  const { grantPowerUp } = usePowerUps()
  const { t } = useLanguage()
  const [rewardedRune, setRewardedRune] = useState<PowerUpType | null>(null)

  useEffect(() => {
    if (rewardedRune === null) return

    const timer = setTimeout(() => setRewardedRune(null), 2500)
    return () => clearTimeout(timer)
  }, [rewardedRune])

  const handlePress = useCallback(async () => {
    const rewarded = await tryShowRewarded('bonusRune')
    if (rewarded) {
      const randomType = RUNE_TYPES[Math.floor(Math.random() * RUNE_TYPES.length)]
      await grantPowerUp(randomType)
      setRewardedRune(randomType)
    }
  }, [tryShowRewarded, grantPowerUp])

  return (
    <>
      <TouchableOpacity
        style={[styles.button, !rewardedReady && styles.disabled]}
        onPress={handlePress}
        disabled={!rewardedReady}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <AdIcon size={12} color={COLORS.grimoire.secondary} />
          <Text style={styles.text}>{t('bonusRune.label')}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={rewardedRune !== null} transparent animationType="fade">
        <TouchableOpacity
          style={styles.rewardOverlay}
          activeOpacity={1}
          onPress={() => setRewardedRune(null)}
        >
          <View style={styles.rewardCard}>
            <View
              style={[
                styles.runeGlow,
                { backgroundColor: rewardedRune ? RUNE_COLORS[rewardedRune] : COLORS.neon.cyan },
              ]}
            />
            <Text style={styles.rewardTitle}>
              {t('bonusRune.rewarded')}
            </Text>
            <Text
              style={[
                styles.rewardRuneName,
                { color: rewardedRune ? RUNE_COLORS[rewardedRune] : COLORS.neon.cyan },
              ]}
            >
              {rewardedRune ? t(`power.${rewardedRune}`) : ''}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.grimoire.secondary + '22',
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '66',
    borderRadius: 6,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  disabled: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.grimoire.secondary,
    letterSpacing: 1,
  },
  rewardOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  rewardCard: {
    alignItems: 'center',
    backgroundColor: COLORS.grimoire.primary,
    borderWidth: 2,
    borderColor: COLORS.grimoire.secondary + '66',
    borderRadius: 16,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
    minWidth: 220,
  },
  runeGlow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: SPACING.md,
    opacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  rewardTitle: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.md,
    color: COLORS.grimoire.secondary,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  rewardRuneName: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    letterSpacing: 3,
  },
})
