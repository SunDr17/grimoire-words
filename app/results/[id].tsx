import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated'
import { GradientBackground, RuneText } from '@/shared/components'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { AdIcon } from '@/features/ads/components/AdIcon'
import { getLevelConfig } from '@/features/game/utils/levelConfig'
import { getCityForLevel } from '@/features/map/utils/cityConfigs'
import { updateLevelProgress, updatePlayerStats, restoreHPInStorage } from '@/persistence/storage'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { useAds } from '@/features/ads/hooks/useAds'
import { useHitPoints } from '@/features/retention/hooks/useHitPoints'
import { NoLivesModal } from '@/features/retention/components/NoLivesModal'

const DAILY_LEVEL_ID = 999

export default function ResultsScreen() {
  const { id, score: scoreStr, stars: starsStr, words: wordsStr } = useLocalSearchParams<{
    id: string
    score: string
    stars: string
    words: string
  }>()

  const { language, t } = useLanguage()
  const { rewardedReady, tryShowInterstitial, tryShowRewarded, trackLevelComplete } = useAds()
  const { hp, lastHpRegen, spendHP } = useHitPoints()
  const levelId = parseInt(id ?? '1', 10)
  const baseScore = parseInt(scoreStr ?? '0', 10)
  const stars = parseInt(starsStr ?? '0', 10)
  const wordsFound = parseInt(wordsStr ?? '0', 10)
  const config = getLevelConfig(levelId, language)
  const won = stars > 0
  const isDaily = levelId === DAILY_LEVEL_ID
  const isHollow = getCityForLevel(levelId) === 'hollow'
  const bgZone = isHollow ? 'hollow' as const : 'grimoire' as const
  const accentColor = isHollow ? COLORS.hollow.secondary : COLORS.thornwall.secondary

  const [noLivesVisible, setNoLivesVisible] = useState(false)
  const [displayScore, setDisplayScore] = useState(baseScore)
  const [doubled, setDoubled] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (saved) return

    async function save() {
      await updatePlayerStats(wordsFound, baseScore, config.isBoss, won)
      if (won) {
        await updateLevelProgress(levelId, stars, baseScore, wordsFound, '')
        await restoreHPInStorage(1)
      }
      setSaved(true)
    }

    save()
  }, [saved, won, levelId, stars, baseScore, wordsFound, config.isBoss])

  // Show interstitial after non-boss level wins
  useEffect(() => {
    if (won && !config.isBoss) {
      trackLevelComplete().then(() => tryShowInterstitial())
    }
  }, [won, config.isBoss, trackLevelComplete, tryShowInterstitial])

  const handleDoubleScore = async () => {
    if (doubled) return
    const rewarded = await tryShowRewarded('doubleScore')
    if (rewarded) {
      const newScore = displayScore * 2
      setDisplayScore(newScore)
      setDoubled(true)
      await updateLevelProgress(levelId, stars, newScore, wordsFound, '')
    }
  }

  const handleDailyMultiplier = async () => {
    if (doubled) return
    const rewarded = await tryShowRewarded('dailyMultiplier')
    if (rewarded) {
      const newScore = displayScore * 2
      setDisplayScore(newScore)
      setDoubled(true)
      await updateLevelProgress(levelId, stars, newScore, wordsFound, '')
    }
  }

  const star1Scale = useSharedValue(0)
  const star2Scale = useSharedValue(0)
  const star3Scale = useSharedValue(0)

  useEffect(() => {
    if (won) {
      star1Scale.value = withDelay(300, withSpring(stars >= 1 ? 1 : 0.3, { damping: 10 }))
      star2Scale.value = withDelay(600, withSpring(stars >= 2 ? 1 : 0.3, { damping: 10 }))
      star3Scale.value = withDelay(900, withSpring(stars >= 3 ? 1 : 0.3, { damping: 10 }))
    }
  }, [stars, won, star1Scale, star2Scale, star3Scale])

  const star1Style = useAnimatedStyle(() => ({
    transform: [{ scale: star1Scale.value }],
    opacity: star1Scale.value,
  }))
  const star2Style = useAnimatedStyle(() => ({
    transform: [{ scale: star2Scale.value }],
    opacity: star2Scale.value,
  }))
  const star3Style = useAnimatedStyle(() => ({
    transform: [{ scale: star3Scale.value }],
    opacity: star3Scale.value,
  }))

  const isLevel50Win = won && levelId === 50
  const isLevel100Win = won && levelId === 100
  const nextLevelId = won && levelId < 100 && !isLevel100Win ? levelId + 1 : levelId

  const handlePlayLevel = useCallback(async () => {
    if (isLevel50Win) {
      router.replace({ pathname: '/(tabs)/map', params: { city: 'hollow' } })
      return
    }
    const spent = await spendHP()
    if (!spent) {
      setNoLivesVisible(true)
      return
    }
    router.replace(`/level/${nextLevelId}`)
  }, [nextLevelId, spendHP, isLevel50Win])

  const handleWatchAdForLife = useCallback(async () => {
    const rewarded = await tryShowRewarded('restoreLife')
    if (rewarded) {
      await restoreHPInStorage(1)
      setNoLivesVisible(false)
      // The restored HP covers the cost of this play
      router.replace(`/level/${nextLevelId}`)
    }
  }, [tryShowRewarded, nextLevelId])

  return (
    <GradientBackground zone={bgZone}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.levelLabel}>{t('results.level', { id: levelId })}</Text>
        <RuneText
          size={FONT_SIZES.xxl}
          color={won ? COLORS.neon.green : COLORS.neon.red}
        >
          {won ? t('results.questComplete') : t('results.questFailed')}
        </RuneText>

        <Text style={styles.locationName}>{config.locationName}</Text>

        {won ? (
          <View style={styles.starsRow}>
            <Animated.Text style={[styles.star, { color: accentColor }, star1Style]}>★</Animated.Text>
            <Animated.Text style={[styles.star, { color: accentColor }, star2Style]}>★</Animated.Text>
            <Animated.Text style={[styles.star, { color: accentColor }, star3Style]}>★</Animated.Text>
          </View>
        ) : (
          <View style={styles.failedRow}>
            <Text style={styles.failedIcon}>💀</Text>
            <Text style={styles.failedText}>{t('results.timeExpired')}</Text>
          </View>
        )}

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('results.score')}</Text>
            <Text style={styles.statValue}>{displayScore}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>{t('results.wordsFound')}</Text>
            <Text style={styles.statValue}>{wordsFound}</Text>
          </View>
          {won && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t('results.xpEarned')}</Text>
              <Text style={[styles.statValue, { color: COLORS.neon.green }]}>
                +{displayScore * 2}
              </Text>
            </View>
          )}
        </View>

        {won && !doubled && !isDaily && (
          <TouchableOpacity
            style={styles.doubleButton}
            onPress={handleDoubleScore}
            activeOpacity={0.8}
          >
            <View style={styles.adRow}>
              <AdIcon size={18} color={COLORS.thornwall.secondary} />
              <Text style={styles.doubleText}>{t('results.doubleScore')}</Text>
            </View>
          </TouchableOpacity>
        )}

        {won && !doubled && isDaily && (
          <TouchableOpacity
            style={styles.doubleButton}
            onPress={handleDailyMultiplier}
            activeOpacity={0.8}
          >
            <View style={styles.adRow}>
              <AdIcon size={18} color={COLORS.thornwall.secondary} />
              <Text style={styles.doubleText}>{t('results.doubleXp')}</Text>
            </View>
          </TouchableOpacity>
        )}

        {config.isBoss && won && (
          <Text style={styles.bossDefeat}>
            {t('results.defeated', { monster: config.monster?.toUpperCase() ?? '' })}
          </Text>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity
            style={won ? styles.nextButton : styles.retryButton}
            onPress={handlePlayLevel}
            activeOpacity={0.8}
          >
            <Text style={won ? styles.nextText : styles.retryText}>
              {won
                ? isLevel50Win
                  ? t('results.enterHollow')
                  : isLevel100Win
                    ? t('results.playAgain')
                    : t('results.nextLevel')
                : t('results.retry')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.mapText}>{t('results.campaignMap')}</Text>
          </TouchableOpacity>
        </View>

        <NoLivesModal
          visible={noLivesVisible}
          lastHpRegen={lastHpRegen}
          rewardedReady={rewardedReady}
          onWatchAd={handleWatchAdForLife}
          onClose={() => setNoLivesVisible(false)}
        />
      </SafeAreaView>
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
  levelLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.grimoire.secondary,
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  locationName: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    marginTop: SPACING.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginVertical: SPACING.xxl,
  },
  star: {
    fontSize: 48,
    color: COLORS.thornwall.secondary,
  },
  failedRow: {
    alignItems: 'center',
    marginVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  failedIcon: {
    fontSize: 48,
  },
  failedText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neon.red,
    letterSpacing: 2,
  },
  statsCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: COLORS.grimoire.primary + 'CC',
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '44',
    borderRadius: 8,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.ui.textDim,
  },
  statValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.ui.textPrimary,
    fontWeight: '700',
  },
  bossDefeat: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neon.red,
    letterSpacing: 3,
    marginTop: SPACING.xl,
  },
  buttons: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
    width: '100%',
    maxWidth: 280,
  },
  retryButton: {
    backgroundColor: COLORS.neon.red + '22',
    borderWidth: 2,
    borderColor: COLORS.neon.red,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neon.red,
    letterSpacing: 2,
  },
  mapButton: {
    backgroundColor: COLORS.grimoire.secondary + '22',
    borderWidth: 2,
    borderColor: COLORS.grimoire.secondary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.grimoire.secondary,
    letterSpacing: 2,
  },
  nextButton: {
    backgroundColor: COLORS.neon.green + '22',
    borderWidth: 2,
    borderColor: COLORS.neon.green,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neon.green,
    letterSpacing: 2,
  },
  doubleButton: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: COLORS.thornwall.secondary + '22',
    borderWidth: 2,
    borderColor: COLORS.thornwall.secondary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  adRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  doubleText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.md,
    color: COLORS.thornwall.secondary,
    letterSpacing: 2,
  },
})
