import React from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import type { CityId } from '@/shared/types'
import { COLORS, FONTS, FONT_SIZES, SPACING } from '@/shared/constants'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

interface CitySwitcherProps {
  readonly activeCity: CityId
  readonly hollowUnlocked: boolean
  readonly onSwitch: (cityId: CityId) => void
}

function LockIcon() {
  return (
    <View style={iconStyles.container}>
      <View style={iconStyles.shackle} />
      <View style={iconStyles.body} />
    </View>
  )
}

export const CitySwitcher = React.memo(function CitySwitcher({
  activeCity,
  hollowUnlocked,
  onSwitch,
}: CitySwitcherProps) {
  const { t } = useLanguage()

  const tabs: readonly { id: CityId; labelKey: string; color: string; locked: boolean }[] = [
    { id: 'thornwall', labelKey: 'city.thornwall', color: COLORS.thornwall.secondary, locked: false },
    { id: 'hollow', labelKey: 'city.hollow', color: COLORS.hollow.secondary, locked: !hollowUnlocked },
  ]

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeCity === tab.id
        return (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              isActive && { borderBottomColor: tab.color },
            ]}
            onPress={() => {
              if (!tab.locked) onSwitch(tab.id)
            }}
            disabled={tab.locked}
          >
            <View style={styles.tabContent}>
              {tab.locked && <LockIcon />}
              <Text
                style={[
                  styles.tabText,
                  isActive && { color: tab.color },
                  tab.locked && styles.lockedText,
                ]}
              >
                {t(tab.labelKey)}
              </Text>
            </View>
            {tab.locked && (
              <Text style={styles.lockedHint}>{t('map.hollow.locked')}</Text>
            )}
          </Pressable>
        )
      })}
    </View>
  )
})

const iconStyles = StyleSheet.create({
  container: {
    width: 10,
    height: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  shackle: {
    width: 7,
    height: 5,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#665544',
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  body: {
    width: 8,
    height: 6,
    backgroundColor: '#665544',
    borderRadius: 1,
  },
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    gap: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  tabText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.sm,
    color: COLORS.ui.textDim,
    letterSpacing: 2,
  },
  lockedText: {
    opacity: 0.5,
  },
  lockedHint: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.ui.textDim,
    opacity: 0.6,
    marginTop: 2,
  },
})
