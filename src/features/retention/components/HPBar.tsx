import { useState, useEffect, memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { REGEN_INTERVAL_MS } from '@/features/retention/hooks/useHitPoints'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

interface HPBarProps {
  readonly hp: number
  readonly maxHp: number
  readonly lastHpRegen?: number
}

function HeartIcon({ filled }: { readonly filled: boolean }) {
  return (
    <View style={[heartStyles.container, !filled && heartStyles.empty]}>
      <View
        style={[
          heartStyles.diamond,
          { backgroundColor: filled ? COLORS.neon.red : '#332222' },
        ]}
      />
    </View>
  )
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const HPBar = memo(function HPBar({ hp, maxHp, lastHpRegen }: HPBarProps) {
  const { t } = useLanguage()
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (hp >= maxHp || lastHpRegen === undefined) {
      setCountdown('')
      return
    }

    function tick() {
      const nextRegenAt = lastHpRegen! + REGEN_INTERVAL_MS
      const remaining = nextRegenAt - Date.now()
      setCountdown(remaining > 0 ? formatCountdown(remaining) : '')
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [hp, maxHp, lastHpRegen])

  return (
    <View style={styles.container}>
      <Text style={styles.label}>HP</Text>
      <View style={styles.hearts}>
        {Array.from({ length: maxHp }, (_, i) => (
          <HeartIcon key={i} filled={i < hp} />
        ))}
      </View>
      {countdown !== '' && (
        <Text style={styles.countdown}>{t('hp.next')} {countdown}</Text>
      )}
    </View>
  )
})

const heartStyles = StyleSheet.create({
  container: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    opacity: 0.35,
  },
  diamond: {
    width: 10,
    height: 10,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    shadowColor: COLORS.neon.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.neon.red,
    fontWeight: '700',
  },
  hearts: {
    flexDirection: 'row',
    gap: 3,
  },
  countdown: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.ui.textDim,
    marginLeft: SPACING.xs,
  },
})
