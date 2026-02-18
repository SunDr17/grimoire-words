import React, { useRef, useEffect, useMemo } from 'react'
import { StyleSheet, ScrollView, View, Dimensions, Text, Image, TouchableOpacity, type ViewStyle, type TextStyle } from 'react-native'
import Svg, { Line, Circle, Defs, RadialGradient, Stop } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, SPACING } from '@/shared/constants'
import type { CityConfig } from '@/features/map/utils/cityConfigs'
import { getStarGateRequirement } from '@/features/game/utils/levelConfig'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { LocationNode } from './LocationNode'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const MAP_PADDING = 12
const MAP_WIDTH = SCREEN_WIDTH - MAP_PADDING * 2
const MAP_HEIGHT = 3600
const NODE_WIDTH = 76

// Pre-computed map theme styles per city (module-level, stable references)
interface MapTheme {
  readonly lineColor: string
  readonly lineColorCC: string
  readonly lineColor66: string
  readonly lineColor44: string
  readonly lineColor88: string
  readonly borderGradient: readonly [string, string, string]
  readonly compassBlade: ViewStyle
  readonly compassCenter: ViewStyle
  readonly titleColor: TextStyle
  readonly subtitleColor: TextStyle
  readonly levelCountColor: TextStyle
  readonly dividerDot: ViewStyle
  readonly dividerLine: ViewStyle
  readonly footerDivider: ViewStyle
}

function createMapTheme(
  lineColor: string,
  parchmentColor: string,
  compassCenter: string,
): MapTheme {
  return {
    lineColor,
    lineColorCC: lineColor + 'CC',
    lineColor66: lineColor + '66',
    lineColor44: lineColor + '44',
    lineColor88: lineColor + '88',
    borderGradient: ['transparent', lineColor + '44', 'transparent'],
    compassBlade: { backgroundColor: parchmentColor },
    compassCenter: { backgroundColor: compassCenter },
    titleColor: { color: parchmentColor },
    subtitleColor: { color: lineColor },
    levelCountColor: { color: lineColor },
    dividerDot: { backgroundColor: lineColor + '88' },
    dividerLine: { backgroundColor: lineColor + '66' },
    footerDivider: { backgroundColor: lineColor + '66' },
  }
}

const MAP_THEMES: Readonly<Record<string, MapTheme>> = {
  thornwall: createMapTheme(
    COLORS.grimoire.secondary,
    COLORS.grimoire.parchment,
    COLORS.thornwall.secondary,
  ),
  hollow: createMapTheme(
    COLORS.hollow.secondary,
    COLORS.hollow.accent,
    COLORS.hollow.accent,
  ),
}

interface CampaignMapProps {
  readonly currentLevel: number
  readonly getLevelStars: (levelId: number) => number
  readonly isLevelUnlocked: (levelId: number) => boolean
  readonly onSelectLevel: (levelId: number) => void
  readonly totalStars?: number
  readonly cityConfig: CityConfig
  readonly onGoToHollow?: () => void
}

export const CampaignMap = React.memo(function CampaignMap({
  currentLevel,
  getLevelStars,
  isLevelUnlocked,
  onSelectLevel,
  totalStars = 0,
  cityConfig,
  onGoToHollow,
}: CampaignMapProps) {
  const { language, t } = useLanguage()
  const scrollRef = useRef<ScrollView>(null)
  const locations = cityConfig.locations
  const [rangeStart, rangeEnd] = cityConfig.levelRange

  const nodeCallbacks = useMemo(() => {
    const map = new Map<number, () => void>()
    locations.forEach((loc) => {
      map.set(loc.id, () => onSelectLevel(loc.id))
    })
    return map
  }, [onSelectLevel, locations])

  // Compute which level to scroll to within this city's range
  const cityCurrentLevel = Math.max(rangeStart, Math.min(rangeEnd, currentLevel))

  useEffect(() => {
    const currentLoc = locations.find((l) => l.id === cityCurrentLevel)
    if (currentLoc && scrollRef.current) {
      const scrollY = Math.max(0, currentLoc.y * MAP_HEIGHT - 300)
      const timer = setTimeout(() => scrollRef.current?.scrollTo({ y: scrollY, animated: false }), 100)
      return () => clearTimeout(timer)
    }
  }, [cityCurrentLevel, locations])

  const levelTotal = rangeEnd - rangeStart + 1
  const cityLevelDisplay = Math.min(currentLevel, rangeEnd) - rangeStart + 1

  const mapTheme = MAP_THEMES[cityConfig.id]

  return (
    <View style={styles.wrapper}>
      {/* Full-screen background image */}
      <Image
        source={cityConfig.mapBackground}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* Dark overlay for readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      {/* Decorative top border */}
      <View style={styles.topBorder}>
        <LinearGradient
          colors={mapTheme.borderGradient}
          style={styles.borderLine}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map title */}
        <View style={styles.titleBlock}>
          <View style={styles.compassIcon}>
            <View style={[styles.compassBlade, mapTheme.compassBlade]} />
            <View style={[styles.compassBlade, styles.compassBladeRotated, mapTheme.compassBlade]} />
            <View style={[styles.compassCenter, mapTheme.compassCenter]} />
          </View>
          <Text style={[styles.mapTitle, mapTheme.titleColor]}>{t(cityConfig.titleKey)}</Text>
          <Text style={[styles.mapTitle2, mapTheme.subtitleColor]}>{t(cityConfig.subtitleKey)}</Text>
          <View style={styles.titleDivider}>
            <View style={[styles.dividerDot, mapTheme.dividerDot]} />
            <View style={[styles.dividerLine, mapTheme.dividerLine]} />
            <View style={[styles.dividerDot, mapTheme.dividerDot]} />
          </View>
          <Text style={styles.mapSubtitle}>{t(cityConfig.loreKey)}</Text>
          <Text style={[styles.levelCount, mapTheme.levelCountColor]}>
            {t('map.levelCount', { current: cityLevelDisplay, total: levelTotal })}
          </Text>
        </View>

        {/* Map area with SVG paths */}
        <View style={[styles.mapArea, { width: MAP_WIDTH, height: MAP_HEIGHT }]}>
          <Svg
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              <RadialGradient id="bossGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={cityConfig.bossGlowColor} stopOpacity="0.3" />
                <Stop offset="1" stopColor={cityConfig.bossGlowColor} stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Connection lines */}
            {locations.slice(0, -1).map((loc, i) => {
              const next = locations[i + 1]
              const x1 = loc.x * MAP_WIDTH
              const y1 = loc.y * MAP_HEIGHT
              const x2 = next.x * MAP_WIDTH
              const y2 = next.y * MAP_HEIGHT
              const bothUnlocked = isLevelUnlocked(loc.id) && isLevelUnlocked(next.id)
              const oneUnlocked = isLevelUnlocked(loc.id) || isLevelUnlocked(next.id)

              return (
                <React.Fragment key={`path-${i}`}>
                  {/* Shadow line */}
                  <Line
                    x1={x1}
                    y1={y1 + 1}
                    x2={x2}
                    y2={y2 + 1}
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth={4}
                  />
                  {/* Main line */}
                  <Line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={
                      bothUnlocked
                        ? mapTheme.lineColorCC
                        : oneUnlocked
                          ? mapTheme.lineColor66
                          : 'rgba(255,255,255,0.08)'
                    }
                    strokeWidth={bothUnlocked ? 2.5 : 1.5}
                    strokeDasharray={next.isBoss ? '6,4' : undefined}
                    strokeLinecap="round"
                  />
                </React.Fragment>
              )
            })}

            {/* Boss location glow circles */}
            {locations.filter((l) => l.isBoss && isLevelUnlocked(l.id)).map((loc) => (
              <Circle
                key={`glow-${loc.id}`}
                cx={loc.x * MAP_WIDTH}
                cy={loc.y * MAP_HEIGHT}
                r={40}
                fill="url(#bossGlow)"
              />
            ))}
          </Svg>

          {/* Location nodes */}
          {locations.map((loc) => (
            <View
              key={loc.id}
              style={[
                styles.nodeContainer,
                {
                  left: loc.x * MAP_WIDTH - NODE_WIDTH / 2,
                  top: loc.y * MAP_HEIGHT - 28,
                },
              ]}
            >
              <LocationNode
                name={loc.name[language]}
                stars={getLevelStars(loc.id)}
                unlocked={isLevelUnlocked(loc.id)}
                isBoss={loc.isBoss}
                isCurrent={loc.id === currentLevel}
                onPress={nodeCallbacks.get(loc.id) ?? (() => {})}
                starGateRequirement={getStarGateRequirement(loc.id)}
                totalStars={totalStars}
                cityId={cityConfig.id}
              />
            </View>
          ))}
        </View>

        {/* Map footer decoration */}
        <View style={styles.footer}>
          <View style={[styles.dividerLine, mapTheme.footerDivider]} />
          <Text style={styles.footerText}>
            {t(cityConfig.footerKey)}
          </Text>
          {onGoToHollow && (
            <TouchableOpacity
              style={styles.hollowButton}
              onPress={onGoToHollow}
              activeOpacity={0.8}
            >
              <Text style={styles.hollowButtonText}>{t('results.enterHollow')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  topBorder: {
    height: 2,
    marginTop: 50,
    zIndex: 10,
  },
  borderLine: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: MAP_PADDING,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  compassIcon: {
    width: 28,
    height: 28,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassBlade: {
    position: 'absolute',
    width: 2,
    height: 26,
    borderRadius: 1,
  },
  compassBladeRotated: {
    transform: [{ rotate: '90deg' }],
  },
  compassCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mapTitle: {
    fontFamily: FONTS.title,
    fontSize: 28,
    letterSpacing: 6,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  mapTitle2: {
    fontFamily: FONTS.title,
    fontSize: 16,
    letterSpacing: 8,
    marginTop: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  titleDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
    gap: SPACING.sm,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dividerLine: {
    width: 100,
    height: 1,
  },
  mapSubtitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: '#CCBBAA',
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  levelCount: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    marginTop: SPACING.xs,
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  mapArea: {
    position: 'relative',
  },
  nodeContainer: {
    position: 'absolute',
  },
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.md,
  },
  footerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: '#CCBBAA',
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hollowButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.hollow.secondary + '22',
    borderWidth: 2,
    borderColor: COLORS.hollow.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 8,
  },
  hollowButtonText: {
    fontFamily: FONTS.title,
    fontSize: 16,
    color: COLORS.hollow.secondary,
    letterSpacing: 3,
    textAlign: 'center',
  },
})
