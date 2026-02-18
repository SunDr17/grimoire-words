import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, type ViewStyle } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { AdIcon } from './AdIcon'

interface ContinueModalProps {
  readonly visible: boolean
  readonly rewardedReady: boolean
  readonly onWatchAd: () => void
  readonly onDecline: () => void
}

const AUTO_DECLINE_SECONDS = 10

export function ContinueModal({
  visible,
  rewardedReady,
  onWatchAd,
  onDecline,
}: ContinueModalProps) {
  const { t } = useLanguage()
  const [countdown, setCountdown] = useState(AUTO_DECLINE_SECONDS)
  const [watchingAd, setWatchingAd] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!visible) {
      setCountdown(AUTO_DECLINE_SECONDS)
      setExpired(false)
      setWatchingAd(false)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [visible])

  useEffect(() => {
    if (watchingAd && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [watchingAd])

  useEffect(() => {
    if (expired && !watchingAd) {
      onDecline()
    }
  }, [expired, watchingAd, onDecline])

  const handleWatchAd = React.useCallback(() => {
    setWatchingAd(true)
    onWatchAd()
  }, [onWatchAd])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('continue.title')}</Text>
          <Text style={styles.subtitle}>{t('continue.subtitle')}</Text>

          <TouchableOpacity
            style={[styles.adButton, (!rewardedReady || watchingAd) && styles.adButtonDisabled]}
            onPress={handleWatchAd}
            disabled={!rewardedReady || watchingAd}
            activeOpacity={0.8}
          >
            <View style={styles.adRow}>
              <AdIcon size={18} color={COLORS.neon.green} />
              <Text style={styles.adButtonText}>{t('continue.watchAd')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineButton}
            onPress={onDecline}
            activeOpacity={0.8}
          >
            <Text style={styles.declineText}>
              {t('continue.decline')} ({countdown})
            </Text>
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
  } as ViewStyle,
  adButtonText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.md,
    color: COLORS.neon.green,
    letterSpacing: 2,
  },
  declineButton: {
    paddingVertical: SPACING.sm,
  },
  declineText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
  },
})
