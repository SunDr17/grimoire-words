import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { AdIcon } from '@/features/ads/components/AdIcon'
import { REGEN_INTERVAL_MS } from '@/features/retention/hooks/useHitPoints'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

interface NoLivesModalProps {
  readonly visible: boolean
  readonly lastHpRegen: number
  readonly rewardedReady: boolean
  readonly onWatchAd: () => void
  readonly onClose: () => void
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function NoLivesModal({
  visible,
  lastHpRegen,
  rewardedReady,
  onWatchAd,
  onClose,
}: NoLivesModalProps) {
  const { t } = useLanguage()
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!visible) return

    function tick() {
      const nextRegenAt = lastHpRegen + REGEN_INTERVAL_MS
      const remaining = nextRegenAt - Date.now()
      setCountdown(remaining > 0 ? formatCountdown(remaining) : '')
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [visible, lastHpRegen])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('noLives.title')}</Text>
          <Text style={styles.subtitle}>{t('noLives.subtitle')}</Text>

          {countdown !== '' && (
            <Text style={styles.timer}>
              {t('noLives.nextLife')}: {countdown}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.adButton, !rewardedReady && styles.adButtonDisabled]}
            onPress={onWatchAd}
            disabled={!rewardedReady}
            activeOpacity={0.8}
          >
            <View style={styles.adRow}>
              <AdIcon size={18} color={COLORS.neon.green} />
              <Text style={styles.adButtonText}>{t('noLives.watchAd')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeText}>{t('noLives.close')}</Text>
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
    width: '85%',
    maxWidth: 320,
    backgroundColor: COLORS.grimoire.primary,
    borderWidth: 2,
    borderColor: COLORS.neon.red + '66',
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neon.red,
    letterSpacing: 3,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  timer: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.md,
    color: COLORS.grimoire.secondary,
    marginBottom: SPACING.lg,
  },
  adButton: {
    width: '100%',
    backgroundColor: COLORS.neon.green + '22',
    borderWidth: 2,
    borderColor: COLORS.neon.green,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  adButtonDisabled: {
    opacity: 0.4,
  },
  adRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  adButtonText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.md,
    color: COLORS.neon.green,
    letterSpacing: 2,
  },
  closeButton: {
    paddingVertical: SPACING.sm,
  },
  closeText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
  },
})
