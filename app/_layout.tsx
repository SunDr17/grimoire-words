import React, { useState, useEffect } from 'react'
import { enableFreeze } from 'react-native-screens'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous'
import { Asset } from 'expo-asset'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { LanguageProvider } from '@/shared/i18n/LanguageProvider'
import { DictionaryProvider } from '@/features/words/DictionaryProvider'
import { AudioProvider } from '@/audio/AudioProvider'
import { COLORS } from '@/shared/constants'
import { initializeAds } from '@/features/ads/services/adService'

import MAP_BG from '../assets/images/map-bg.png'

enableFreeze(true)
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Righteous_400Regular })
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    Asset.loadAsync([MAP_BG]).then(() => setAssetsLoaded(true))
  }, [])

  useEffect(() => {
    if (fontsLoaded && assetsLoaded) {
      initializeAds()
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, assetsLoaded])

  if (!fontsLoaded || !assetsLoaded) return null

  return (
    <GestureHandlerRootView style={styles.root}>
      <LanguageProvider>
        <AudioProvider>
          <DictionaryProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.thornwall.primary },
                animation: 'fade',
              }}
            />
          </DictionaryProvider>
        </AudioProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.thornwall.primary,
  },
})
