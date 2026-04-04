import React, { useEffect, useCallback } from 'react'
import { StyleSheet, View, Pressable, Text, Dimensions, Image } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg'
import { router } from 'expo-router'
import { RuneText, VHSOverlay, CRTEffect } from '@/shared/components'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { useDictionary } from '@/features/words/DictionaryProvider'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

import MAP_BG from '../assets/images/map-bg.png'

export default function TitleScreen() {
  const { ready, wordCount } = useDictionary()
  const { language, setLanguage, t } = useLanguage()
  const titleFlicker = useSharedValue(1)
  const lightPulse = useSharedValue(0.6)

  useEffect(() => {
    titleFlicker.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(0.9, { duration: 2000 }),
        withTiming(1, { duration: 2000 }),
      ),
      -1,
    )
    lightPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 }),
      ),
      -1,
      true,
    )
  }, [titleFlicker, lightPulse])

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleFlicker.value,
  }))

  const lightGlowStyle = useAnimatedStyle(() => ({
    opacity: lightPulse.value,
  }))

  const handlePlay = useCallback(() => {
    router.push('/map')
  }, [])

  return (
    <View style={styles.screen}>
      {/* Full-screen background image */}
      <Image source={MAP_BG} style={styles.bgImage} resizeMode="cover" />

      {/* Dark overlay for readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.40)', 'rgba(0,0,0,0.20)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.45)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      {/* Subtle red glow accent */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="titleRedGlow" cx="50%" cy="40%" r="45%">
            <Stop offset="0" stopColor="#FF0000" stopOpacity="0.15" />
            <Stop offset="1" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#titleRedGlow)" />
      </Svg>

      {/* Vignette */}
      <LinearGradient
        colors={['rgba(0,0,0,0.25)', 'transparent', 'transparent', 'rgba(0,0,0,0.30)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      <VHSOverlay />
      <CRTEffect />

      <View style={styles.container}>
        {/* Christmas lights row with animated glow */}
        <Animated.View style={[styles.lightsRow, lightGlowStyle]}>
          {COLORS.wardStones.map((color, i) => (
            <View key={i} style={[styles.light, { backgroundColor: color, shadowColor: color }]} />
          ))}
        </Animated.View>

        <Animated.View style={[styles.titleContainer, titleStyle]} pointerEvents="none">
          <RuneText
            size={FONT_SIZES.hero}
            color={COLORS.neon.red}
            style={styles.titleText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            GRIMOIRE
          </RuneText>
        </Animated.View>

        <Text style={styles.subtitle}>{t('title.subtitle')}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            !ready && styles.playButtonDisabled,
            pressed && ready && styles.playButtonPressed,
          ]}
          onPress={handlePlay}
          disabled={!ready}
        >
          <Text
            style={[styles.playButtonText, !ready && styles.playButtonTextDisabled]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {ready ? t('title.play') : t('title.loading')}
          </Text>
        </Pressable>

        {ready && (
          <Text style={styles.wordCount}>
            {t('title.wordCount', { count: wordCount.toLocaleString() })}
          </Text>
        )}

        <View style={styles.langRow}>
          <Pressable
            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
          </Pressable>
          <View style={styles.langDivider} />
          <Pressable
            style={[styles.langButton, language === 'ru' && styles.langButtonActive]}
            onPress={() => setLanguage('ru')}
          >
            <Text style={[styles.langText, language === 'ru' && styles.langTextActive]}>RU</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>{t('title.footer')}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  lightsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: SPACING.xxxl,
  },
  light: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    width: '100%',
  },
  titleText: {
    width: '100%',
  },
  subtitle: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.thornwall.secondary,
    letterSpacing: 2,
    marginBottom: SPACING.xxxl,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  playButton: {
    backgroundColor: COLORS.neon.red + '22',
    borderWidth: 2,
    borderColor: COLORS.neon.red,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    shadowColor: COLORS.neon.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
  },
  playButtonDisabled: {
    borderColor: COLORS.ui.textDim,
    shadowOpacity: 0,
    backgroundColor: 'transparent',
  },
  playButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  playButtonText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.xl,
    color: COLORS.neon.red,
    letterSpacing: 3,
    textAlign: 'center',
  },
  playButtonTextDisabled: {
    color: COLORS.ui.textDim,
  },
  wordCount: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textDim,
    marginTop: SPACING.lg,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  langButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  langButtonActive: {
    backgroundColor: COLORS.grimoire.secondary + '33',
  },
  langText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    letterSpacing: 2,
  },
  langTextActive: {
    color: COLORS.grimoire.secondary,
    fontWeight: '700',
  },
  langDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.ui.textDim + '44',
  },
  footer: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.ui.textDim,
    position: 'absolute',
    bottom: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
})
