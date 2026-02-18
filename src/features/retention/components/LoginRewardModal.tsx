import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { LoginRewardsCalendar } from './LoginRewardsCalendar'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import type { DailyReward } from '../types'

interface LoginRewardModalProps {
  readonly visible: boolean
  readonly currentDay: number
  readonly todayReward: DailyReward
  readonly onClaim: () => void
  readonly onClose: () => void
}

export function LoginRewardModal({
  visible,
  currentDay,
  todayReward,
  onClaim,
  onClose,
}: LoginRewardModalProps) {
  const { t } = useLanguage()

  const totalRunes = todayReward.runes.reduce((sum, r) => sum + r.amount, 0)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('loginReward.title')}</Text>
          <Text style={styles.dayText}>
            {t('loginReward.day', { day: ((currentDay - 1) % 7) + 1 })}
          </Text>

          <LoginRewardsCalendar currentDay={currentDay} />

          <View style={styles.rewardSummary}>
            <Text style={styles.rewardText}>
              {totalRunes > 1
                ? t('loginReward.runesPlural', { count: totalRunes })
                : t('loginReward.runes', { count: totalRunes })}
            </Text>
            {todayReward.hp > 0 && (
              <Text style={styles.rewardHp}>+{todayReward.hp} HP</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.claimButton}
            onPress={onClaim}
            activeOpacity={0.8}
          >
            <Text style={styles.claimText}>{t('loginReward.claim')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeText}>{'✕'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  card: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: COLORS.grimoire.primary,
    borderWidth: 2,
    borderColor: COLORS.grimoire.secondary + '66',
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.grimoire.secondary,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  dayText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    marginBottom: SPACING.md,
  },
  rewardSummary: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  rewardText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.md,
    color: COLORS.grimoire.secondary,
    letterSpacing: 1,
  },
  rewardHp: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.md,
    color: COLORS.neon.red,
    letterSpacing: 1,
  },
  claimButton: {
    width: '100%',
    backgroundColor: COLORS.neon.green + '22',
    borderWidth: 2,
    borderColor: COLORS.neon.green,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  claimText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.lg,
    color: COLORS.neon.green,
    letterSpacing: 2,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.ui.textDim,
  },
})
