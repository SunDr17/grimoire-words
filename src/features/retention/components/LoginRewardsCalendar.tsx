import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { getRewardForDay } from '../utils/loginRewards'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

interface LoginRewardsCalendarProps {
  readonly currentDay: number
}

export function LoginRewardsCalendar({ currentDay }: LoginRewardsCalendarProps) {
  const { t } = useLanguage()
  const cycleStart = Math.floor((currentDay - 1) / 7) * 7

  return (
    <View style={styles.container}>
      {Array.from({ length: 7 }, (_, i) => {
        const day = cycleStart + i + 1
        const reward = getRewardForDay(day)
        const isPast = day < currentDay
        const isCurrent = day === currentDay

        return (
          <View
            key={i}
            style={[
              styles.dayCard,
              isPast && styles.dayPast,
              isCurrent && styles.dayCurrent,
            ]}
          >
            <Text style={[styles.dayLabel, isCurrent && styles.dayLabelCurrent]}>
              {t('loginReward.day', { day: i + 1 })}
            </Text>
            <Text style={styles.runeCount}>
              {reward.runes.reduce((sum, r) => sum + r.amount, 0)} {t('loginReward.runesShort')}
            </Text>
            {reward.hp > 0 && (
              <Text style={styles.hpCount}>+{reward.hp} HP</Text>
            )}
            {isPast && <Text style={styles.checkmark}>{'✓'}</Text>}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  dayCard: {
    width: '13%',
    minWidth: 40,
    backgroundColor: COLORS.grimoire.primary + 'CC',
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '33',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
    minHeight: 58,
    justifyContent: 'center',
  },
  dayPast: {
    opacity: 0.5,
  },
  dayCurrent: {
    borderColor: COLORS.grimoire.secondary,
    borderWidth: 2,
    backgroundColor: COLORS.grimoire.secondary + '22',
  },
  dayLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.ui.textDim,
    marginBottom: 2,
  },
  dayLabelCurrent: {
    color: COLORS.grimoire.secondary,
    fontWeight: '700',
  },
  runeCount: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.ui.textPrimary,
    marginTop: 2,
    fontWeight: '600',
  },
  hpCount: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.neon.red,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 12,
    color: COLORS.neon.green,
    marginTop: 2,
  },
})
