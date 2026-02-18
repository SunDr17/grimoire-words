import React, { useState, useCallback } from 'react'
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { GradientBackground, RuneText } from '@/shared/components'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { getStats } from '@/persistence/storage'
import { type PlayerStats, createDefaultStats } from '@/persistence/types'
import { useGameProgress } from '@/persistence/hooks/useGameProgress'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import type { Language } from '@/shared/types'

export default function ProfileScreen() {
  const { progress } = useGameProgress()
  const [stats, setStats] = useState<PlayerStats>(createDefaultStats())
  const { language, setLanguage, t } = useLanguage()

  useFocusEffect(
    useCallback(() => {
      getStats().then(setStats)
    }, []),
  )

  const statRows: readonly { label: string; value: string }[] = [
    { label: t('profile.campaignLevel'), value: String(Math.min(100, progress.currentLevel)) },
    { label: t('profile.totalStars'), value: `${progress.totalStars} / ${progress.levels[50]?.completed ? 300 : 150}` },
    { label: t('profile.wordsDiscovered'), value: String(stats.totalWordsFound) },
    { label: t('profile.totalScore'), value: stats.totalScore.toLocaleString() },
    { label: t('profile.longestWord'), value: stats.longestWord || '---' },
    { label: t('profile.monstersDefeated'), value: String(stats.monstersDefeated) },
    { label: t('profile.gamesPlayed'), value: String(stats.gamesPlayed) },
    { label: t('profile.currentStreak'), value: t('profile.days', { count: stats.currentStreak }) },
    { label: t('profile.bestStreak'), value: t('profile.days', { count: stats.bestStreak }) },
  ]

  const languageOptions: readonly { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'ru', label: 'RU' },
  ]

  return (
    <GradientBackground zone="grimoire">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <RuneText size={FONT_SIZES.xl} color={COLORS.grimoire.secondary}>
          {t('profile.characterSheet')}
        </RuneText>

        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>{t('profile.language')}</Text>
          <View style={styles.languageToggle}>
            {languageOptions.map((opt) => (
              <Pressable
                key={opt.value}
                style={[
                  styles.languageButton,
                  language === opt.value && styles.languageButtonActive,
                ]}
                onPress={() => setLanguage(opt.value)}
              >
                <Text
                  style={[
                    styles.languageButtonText,
                    language === opt.value && styles.languageButtonTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.className}>{t('profile.wordWizard')}</Text>
            <Text style={styles.level}>{t('profile.level', { level: progress.currentLevel })}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t('profile.stats')}</Text>
          {statRows.map((row) => (
            <View key={row.label} style={styles.statRow}>
              <Text style={styles.statLabel}>{row.label}</Text>
              <Text style={styles.statValue}>{row.value}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t('profile.feats')}</Text>
          <Text style={styles.featPlaceholder}>
            {t('profile.featsDescription')}
          </Text>
        </View>
      </ScrollView>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl + 20,
    paddingBottom: SPACING.xxxl,
    alignItems: 'center',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  languageLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.grimoire.parchment,
    letterSpacing: 2,
  },
  languageToggle: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '66',
    overflow: 'hidden',
  },
  languageButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'transparent',
  },
  languageButtonActive: {
    backgroundColor: COLORS.grimoire.secondary + '44',
  },
  languageButtonText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    fontWeight: '700',
    letterSpacing: 1,
  },
  languageButtonTextActive: {
    color: COLORS.grimoire.secondary,
  },
  sheet: {
    width: '100%',
    backgroundColor: COLORS.grimoire.parchment + '22',
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '44',
    borderRadius: 8,
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
  },
  className: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.grimoire.parchment,
    letterSpacing: 3,
  },
  level: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.grimoire.secondary,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grimoire.secondary + '33',
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.grimoire.secondary,
    letterSpacing: 3,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
  },
  statValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textPrimary,
    fontWeight: '700',
  },
  featPlaceholder: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    textAlign: 'center',
    fontStyle: 'italic',
  },
})
