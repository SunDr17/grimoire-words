import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import type { Objective, BonusObjective } from '@/shared/types'
import { getObjectiveProgress, type GameStateForObjective } from '@/features/game/utils/objectives'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { DoomClock } from './DoomClock'

interface ObjectiveBarProps {
  readonly objective: Objective
  readonly bonusObjective: BonusObjective
  readonly gameState: GameStateForObjective
  readonly timeRemaining: number
  readonly maxTime: number
  readonly score: number
  readonly frozen?: boolean
}

export function ObjectiveBar({
  objective,
  bonusObjective,
  gameState,
  timeRemaining,
  maxTime,
  score,
  frozen = false,
}: ObjectiveBarProps) {
  const { language, t } = useLanguage()
  const progress = getObjectiveProgress(gameState, objective, language)
  const progressPercent = Math.min(1, progress.current / Math.max(1, progress.target))

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <DoomClock timeRemaining={timeRemaining} maxTime={maxTime} frozen={frozen} />

        <View style={styles.objectiveSection}>
          <Text style={styles.objectiveText} numberOfLines={1}>
            {progress.label}
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercent * 100}%`,
                  backgroundColor: progress.complete
                    ? COLORS.neon.green
                    : COLORS.thornwall.secondary,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.current}/{progress.target}
          </Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>{t('hud.score')}</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      <Text style={styles.bonusText} numberOfLines={1}>
        {t('hud.bonus', { label: bonusObjective.label })}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.thornwall.wallpaperLight + '44',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  objectiveSection: {
    flex: 1,
    marginHorizontal: SPACING.md,
    alignItems: 'center',
  },
  objectiveText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textPrimary,
    marginBottom: 2,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.thornwall.wallpaper,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textSecondary,
    marginTop: 1,
  },
  scoreSection: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textDim,
  },
  scoreValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.thornwall.secondary,
  },
  bonusText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textDim,
    textAlign: 'center',
    marginTop: 4,
  },
})
