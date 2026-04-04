import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Rect, Defs, RadialGradient, Stop, Circle } from 'react-native-svg'
import { COLORS } from '@/shared/constants'

type Zone = 'thornwall' | 'hollow' | 'grimoire'

interface GradientBackgroundProps {
  readonly zone?: Zone
  readonly children: React.ReactNode
}

export function GradientBackground({
  zone = 'thornwall',
  children,
}: GradientBackgroundProps) {
  if (zone === 'thornwall') {
    return <ThornwallBackground>{children}</ThornwallBackground>
  }

  if (zone === 'hollow') {
    return <HollowBackground>{children}</HollowBackground>
  }

  return <GrimoireBackground>{children}</GrimoireBackground>
}

function ThornwallBackground({ children }: { readonly children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* Base warm gradient */}
      <LinearGradient
        colors={['#2D1808', '#3D2510', '#2D1808', '#1E1006']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Warm ambient light from center */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="warmGlow" cx="50%" cy="35%" r="60%">
            <Stop offset="0" stopColor="#DAA520" stopOpacity="0.12" />
            <Stop offset="0.5" stopColor="#8B4513" stopOpacity="0.06" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="cornerGlow1" cx="0%" cy="0%" r="50%">
            <Stop offset="0" stopColor="#CC6600" stopOpacity="0.08" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="cornerGlow2" cx="100%" cy="80%" r="50%">
            <Stop offset="0" stopColor="#8B0000" stopOpacity="0.08" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#warmGlow)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#cornerGlow1)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#cornerGlow2)" />
      </Svg>

      {/* Subtle vignette via gradient overlays */}
      <LinearGradient
        colors={['rgba(0,0,0,0.20)', 'transparent', 'transparent', 'rgba(0,0,0,0.25)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'transparent', 'transparent', 'rgba(0,0,0,0.15)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        pointerEvents="none"
      />

      {children}
    </View>
  )
}

function HollowBackground({ children }: { readonly children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0505', '#150808', '#100505', '#0A0505']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="redVoid" cx="50%" cy="40%" r="70%">
            <Stop offset="0" stopColor="#CC0000" stopOpacity="0.14" />
            <Stop offset="0.6" stopColor="#330000" stopOpacity="0.08" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#redVoid)" />
      </Svg>

      {/* Red vignette edges */}
      <LinearGradient
        colors={['rgba(100,0,0,0.3)', 'transparent', 'transparent', 'rgba(100,0,0,0.3)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        pointerEvents="none"
      />

      {children}
    </View>
  )
}

function GrimoireBackground({ children }: { readonly children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2D1E10', '#3D2818', '#2D1E10', '#3D2818', '#2D1E10']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <RadialGradient id="parchGlow" cx="50%" cy="30%" r="60%">
            <Stop offset="0" stopColor="#8B6914" stopOpacity="0.10" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#parchGlow)" />
      </Svg>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
