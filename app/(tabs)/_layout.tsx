import React from 'react'
import { Tabs } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { COLORS, FONTS } from '@/shared/constants'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

function MapIcon({ focused }: { focused: boolean }) {
  const color = focused ? COLORS.neon.red : COLORS.ui.textDim
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8 2v16M16 6v16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

function QuestIcon({ focused }: { focused: boolean }) {
  const color = focused ? COLORS.neon.red : COLORS.ui.textDim
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 7v5M10 9h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  )
}

function HeroIcon({ focused }: { focused: boolean }) {
  const color = focused ? COLORS.neon.red : COLORS.ui.textDim
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L9 9H2l6 4.5L5.5 21 12 16.5 18.5 21 16 13.5 22 9h-7L12 2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default function TabsLayout() {
  const { t } = useLanguage()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#241408',
          borderTopColor: COLORS.thornwall.wallpaperLight + '66',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.neon.red,
        tabBarInactiveTintColor: COLORS.ui.textDim,
        tabBarLabelStyle: {
          fontFamily: FONTS.mono,
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: t('tab.campaign'),
          tabBarIcon: ({ focused }) => <MapIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: t('tab.quest'),
          tabBarIcon: ({ focused }) => <QuestIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab.hero'),
          tabBarIcon: ({ focused }) => <HeroIcon focused={focused} />,
        }}
      />
    </Tabs>
  )
}
