import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated'
import type { CityId } from '@/shared/types'
import { COLORS, FONTS } from '@/shared/constants'

interface LocationNodeProps {
  readonly name: string
  readonly stars: number
  readonly unlocked: boolean
  readonly isBoss: boolean
  readonly isCurrent: boolean
  readonly onPress: () => void
  readonly starGateRequirement?: number
  readonly totalStars?: number
  readonly cityId?: CityId
}

function BossIcon({
  color = COLORS.neon.red,
  bgColor = '#1A0000',
}: {
  readonly color?: string
  readonly bgColor?: string
}) {
  return (
    <View style={iconStyles.bossContainer}>
      <View style={[iconStyles.skullTop, { backgroundColor: color }]} />
      <View style={[iconStyles.skullFace, { backgroundColor: color }]}>
        <View style={[iconStyles.skullEye, { backgroundColor: bgColor }]} />
        <View style={[iconStyles.skullEye, { backgroundColor: bgColor }]} />
      </View>
      <View style={[iconStyles.skullJaw, { backgroundColor: color }]} />
    </View>
  )
}

function LockIcon({ size = 14 }: { readonly size?: number }) {
  const bodyW = size * 0.7
  const bodyH = size * 0.5
  const shackleSize = size * 0.5
  return (
    <View style={[iconStyles.lockContainer, { width: size, height: size }]}>
      <View
        style={[
          iconStyles.lockShackle,
          {
            width: shackleSize,
            height: shackleSize * 0.6,
            borderRadius: shackleSize / 2,
            borderWidth: size * 0.12,
          },
        ]}
      />
      <View style={[iconStyles.lockBody, { width: bodyW, height: bodyH, borderRadius: size * 0.08 }]} />
    </View>
  )
}

// Pre-computed city theme styles (module-level, zero per-render allocation)
const thornwallTheme = StyleSheet.create({
  bossBg: { backgroundColor: '#1A0000' },
  completedBg: { backgroundColor: '#2A1800' },
  defaultBg: { backgroundColor: '#1A1008' },
  bossNodeBorder: { borderColor: COLORS.neon.red, borderWidth: 3 },
  completedNodeBorder: { borderColor: COLORS.thornwall.secondary, borderWidth: 2 },
  currentNodeBorder: { borderColor: COLORS.neon.green, borderWidth: 2 },
  unlockedNodeBorder: { borderColor: '#997744', borderWidth: 2 },
  lockedNodeBorder: { borderColor: '#221508', borderWidth: 2 },
  bossGlow: { borderColor: COLORS.neon.red, shadowColor: COLORS.neon.red },
  currentGlow: { borderColor: COLORS.neon.green, shadowColor: COLORS.neon.green },
  checkmark: { color: COLORS.thornwall.secondary },
  currentDot: { backgroundColor: COLORS.neon.green },
  unlockedDot: { backgroundColor: '#997744' },
  bossLabel: { color: COLORS.neon.red },
  currentLabel: { color: COLORS.neon.green },
  completedLabel: { color: COLORS.grimoire.parchment },
  lockedLabel: { color: '#8B7355' },
  starFilled: {
    backgroundColor: COLORS.thornwall.secondary,
    shadowColor: COLORS.thornwall.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  starEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.thornwall.secondary + '55',
  },
  starGateText: { color: COLORS.thornwall.secondary },
})

const hollowTheme = StyleSheet.create({
  bossBg: { backgroundColor: '#000A0A' },
  completedBg: { backgroundColor: '#0A0015' },
  defaultBg: { backgroundColor: '#080810' },
  bossNodeBorder: { borderColor: COLORS.neon.cyan, borderWidth: 3 },
  completedNodeBorder: { borderColor: COLORS.hollow.secondary, borderWidth: 2 },
  currentNodeBorder: { borderColor: COLORS.neon.green, borderWidth: 2 },
  unlockedNodeBorder: { borderColor: '#556677', borderWidth: 2 },
  lockedNodeBorder: { borderColor: '#0A0810', borderWidth: 2 },
  bossGlow: { borderColor: COLORS.neon.cyan, shadowColor: COLORS.neon.cyan },
  currentGlow: { borderColor: COLORS.neon.green, shadowColor: COLORS.neon.green },
  checkmark: { color: COLORS.hollow.secondary },
  currentDot: { backgroundColor: COLORS.neon.green },
  unlockedDot: { backgroundColor: '#556677' },
  bossLabel: { color: COLORS.neon.cyan },
  currentLabel: { color: COLORS.neon.green },
  completedLabel: { color: COLORS.hollow.accent },
  lockedLabel: { color: '#445566' },
  starFilled: {
    backgroundColor: COLORS.hollow.secondary,
    shadowColor: COLORS.hollow.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  starEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.hollow.secondary + '55',
  },
  starGateText: { color: COLORS.hollow.secondary },
})

const THEMES = { thornwall: thornwallTheme, hollow: hollowTheme } as const

export const LocationNode = React.memo(function LocationNode({
  name,
  stars,
  unlocked,
  isBoss,
  isCurrent,
  onPress,
  starGateRequirement,
  totalStars = 0,
  cityId = 'thornwall',
}: LocationNodeProps) {
  const theme = THEMES[cityId]
  const isStarGated = starGateRequirement !== undefined && totalStars < starGateRequirement
  const pulseScale = useSharedValue(1)
  const glowOpacity = useSharedValue(0.4)

  useEffect(() => {
    if (isCurrent) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1000 }),
          withTiming(1, { duration: 1000 }),
        ),
        -1,
        true,
      )
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 }),
        ),
        -1,
        true,
      )
    }
    if (isBoss && unlocked && !isCurrent) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 800 }),
          withTiming(0.3, { duration: 800 }),
        ),
        -1,
        true,
      )
    }
    return () => {
      cancelAnimation(pulseScale)
      cancelAnimation(glowOpacity)
    }
  }, [isCurrent, isBoss, unlocked, pulseScale, glowOpacity])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }))

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }))

  const completed = stars > 0

  // All style selections use pre-computed static references — zero allocation
  const bgStyle = isBoss ? theme.bossBg : completed ? theme.completedBg : theme.defaultBg
  const borderStyle = isBoss
    ? theme.bossNodeBorder
    : isCurrent
      ? theme.currentNodeBorder
      : completed
        ? theme.completedNodeBorder
        : unlocked
          ? theme.unlockedNodeBorder
          : theme.lockedNodeBorder
  const glowTheme = isBoss ? theme.bossGlow : theme.currentGlow
  const labelStyle = unlocked
    ? isBoss
      ? theme.bossLabel
      : isCurrent
        ? theme.currentLabel
        : theme.completedLabel
    : theme.lockedLabel

  const starDisplay = useMemo(
    () => stars > 0 ? Array.from({ length: 3 }, (_, i) => i < stars) : null,
    [stars],
  )

  const isHollow = cityId === 'hollow'
  const bossColor = isHollow ? COLORS.neon.cyan : COLORS.neon.red
  const bossBgColor = isHollow ? '#000A0A' : '#1A0000'

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!unlocked}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.nodeWrapper, pulseStyle]}>
        {/* Outer glow ring */}
        {(isCurrent || (isBoss && unlocked)) && (
          <Animated.View
            style={[styles.glowRing, glowTheme, glowStyle]}
          />
        )}

        <View
          style={[
            styles.node,
            bgStyle,
            borderStyle,
            !unlocked && styles.locked,
          ]}
        >
          {isBoss ? (
            isCurrent || unlocked ? (
              <BossIcon color={bossColor} bgColor={bossBgColor} />
            ) : (
              <LockIcon size={16} />
            )
          ) : completed ? (
            <Text style={[styles.checkmark, theme.checkmark]}>{'✓'}</Text>
          ) : isCurrent ? (
            <View style={[styles.currentDot, theme.currentDot]} />
          ) : unlocked ? (
            <View style={[styles.dot, theme.unlockedDot]} />
          ) : (
            <LockIcon size={14} />
          )}
        </View>
      </Animated.View>

      <Text
        style={[styles.label, labelStyle, !unlocked && styles.lockedLabelShadow]}
        numberOfLines={2}
      >
        {name}
      </Text>

      {starDisplay && (
        <View style={styles.starRow}>
          {starDisplay.map((filled, i) => (
            <View
              key={i}
              style={[
                styles.starDiamond,
                filled ? theme.starFilled : theme.starEmpty,
              ]}
            />
          ))}
        </View>
      )}
      {isStarGated && unlocked && (
        <Text style={[styles.starGateText, theme.starGateText]}>
          {'★'} {starGateRequirement}
        </Text>
      )}
    </TouchableOpacity>
  )
})

const iconStyles = StyleSheet.create({
  bossContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
  },
  skullTop: {
    width: 14,
    height: 8,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  skullFace: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    width: 14,
    paddingVertical: 1,
  },
  skullEye: {
    width: 3,
    height: 3,
    borderRadius: 1,
  },
  skullJaw: {
    width: 10,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    opacity: 0.7,
  },
  lockContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  lockShackle: {
    borderColor: '#665544',
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  lockBody: {
    backgroundColor: '#665544',
  },
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
  },
  nodeWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  node: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  locked: {
    opacity: 0.8,
  },
  currentDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowColor: COLORS.neon.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 11,
  },
  lockedLabelShadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  starRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 3,
  },
  starDiamond: {
    width: 7,
    height: 7,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  starGateText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    marginTop: 2,
    letterSpacing: 1,
  },
})
