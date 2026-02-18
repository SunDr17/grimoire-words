import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { GradientBackground, RuneText } from '@/shared/components'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { getDailyDateString } from '@/features/retention/utils/dailySeed'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { useHitPoints } from '@/features/retention/hooks/useHitPoints'
import { useAds } from '@/features/ads/hooks/useAds'
import { NoLivesModal } from '@/features/retention/components/NoLivesModal'

export default function DailyScreen() {
  const dateStr = getDailyDateString()
  const { t } = useLanguage()
  const { hp, lastHpRegen, spendHP, restoreHP } = useHitPoints()
  const { rewardedReady, tryShowRewarded } = useAds()
  const [noLivesVisible, setNoLivesVisible] = useState(false)

  const handlePlay = async () => {
    if (hp <= 0) {
      setNoLivesVisible(true)
      return
    }

    const spent = await spendHP()
    if (!spent) {
      setNoLivesVisible(true)
      return
    }

    router.push('/level/99')
  }

  const handleWatchAdForLife = async () => {
    const rewarded = await tryShowRewarded('restoreLife')
    if (rewarded) {
      await restoreHP(1)
      setNoLivesVisible(false)
    }
  }

  return (
    <GradientBackground zone="grimoire">
      <View style={styles.container}>
        <View style={styles.scroll}>
          <View style={styles.scrollTop} />
          <View style={styles.scrollBody}>
            <Text style={styles.scrollLabel}>{t('daily.label')}</Text>
            <RuneText size={FONT_SIZES.xl} color={COLORS.grimoire.secondary}>
              {dateStr}
            </RuneText>
            <View style={styles.divider} />
            <Text style={styles.description}>
              {t('daily.description')}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.rewards}>
              {t('daily.rewards')}
            </Text>
          </View>
          <View style={styles.scrollBottom} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePlay} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{t('daily.accept')}</Text>
        </TouchableOpacity>
      </View>
      <NoLivesModal
        visible={noLivesVisible}
        lastHpRegen={lastHpRegen}
        rewardedReady={rewardedReady}
        onWatchAd={handleWatchAdForLife}
        onClose={() => setNoLivesVisible(false)}
      />
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  scroll: {
    width: '100%',
    maxWidth: 320,
  },
  scrollTop: {
    height: 20,
    backgroundColor: COLORS.grimoire.parchment,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.grimoire.parchmentDark,
  },
  scrollBody: {
    backgroundColor: COLORS.grimoire.parchment,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  scrollBottom: {
    height: 20,
    backgroundColor: COLORS.grimoire.parchment,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 2,
    borderTopColor: COLORS.grimoire.parchmentDark,
  },
  scrollLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.grimoire.ink,
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: COLORS.grimoire.ink + '44',
    marginVertical: SPACING.md,
  },
  description: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.grimoire.ink,
    textAlign: 'center',
    lineHeight: 20,
  },
  rewards: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.grimoire.secondary,
    fontWeight: '700',
  },
  button: {
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.grimoire.secondary + '33',
    borderWidth: 2,
    borderColor: COLORS.grimoire.secondary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.grimoire.secondary,
    letterSpacing: 2,
  },
})
