import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import { RuneText } from '@/shared/components'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import type { LevelConfig } from '@/shared/types'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

interface LevelIntroProps {
  readonly config: LevelConfig
  readonly onComplete: () => void
}

export function LevelIntro({ config, onComplete }: LevelIntroProps) {
  const { t } = useLanguage()
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withDelay(2800, withTiming(0, { duration: 500 })),
    )
    scale.value = withSequence(
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withDelay(2800, withTiming(1.1, { duration: 500 })),
    )

    const timer = setTimeout(onComplete, 3800)
    return () => clearTimeout(timer)
  }, [opacity, scale, onComplete])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.content, animStyle]}>
        <Text style={styles.levelLabel}>
          {t('intro.level', { id: config.id })}
        </Text>
        <RuneText size={FONT_SIZES.xxl} color={COLORS.neon.red}>
          {config.locationName}
        </RuneText>
        <View style={styles.divider} />
        <Text style={styles.objectiveText}>
          {config.objective.label}
        </Text>
        <Text style={styles.bonusText}>
          {t('intro.bonus', { label: config.bonusObjective.label })}
        </Text>
        {config.modifier && (
          <View style={styles.modifierBadge}>
            <Text style={styles.modifierText}>
              {t(`modifier.${config.modifier}`)}
            </Text>
            <Text style={styles.modifierDesc}>
              {t(`modifier.${config.modifier}.desc`)}
            </Text>
          </View>
        )}
        {config.isBoss && config.monster && (
          <Text style={styles.bossText}>
            {t('intro.boss', { monster: config.monster.toUpperCase() })}
          </Text>
        )}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 50,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  levelLabel: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.thornwall.secondary,
    letterSpacing: 4,
    marginBottom: SPACING.sm,
  },
  divider: {
    width: 120,
    height: 1,
    backgroundColor: COLORS.thornwall.secondary + '66',
    marginVertical: SPACING.lg,
  },
  objectiveText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.lg,
    color: COLORS.ui.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  bonusText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    textAlign: 'center',
  },
  modifierBadge: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.thornwall.secondary + '22',
    borderWidth: 1,
    borderColor: COLORS.thornwall.secondary + '66',
    borderRadius: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  modifierText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.sm,
    color: COLORS.thornwall.secondary,
    letterSpacing: 2,
  },
  modifierDesc: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.ui.textDim,
    marginTop: 2,
  },
  bossText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.neon.red,
    letterSpacing: 3,
    marginTop: SPACING.lg,
  },
})
