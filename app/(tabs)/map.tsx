import React, { useState, useCallback, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { GradientBackground } from '@/shared/components'
import { COLORS } from '@/shared/constants'
import type { CityId } from '@/shared/types'
import { CampaignMap } from '@/features/map/components/CampaignMap'
import { CitySwitcher } from '@/features/map/components/CitySwitcher'
import { CITY_CONFIGS } from '@/features/map/utils/cityConfigs'
import { useGameProgress } from '@/persistence/hooks/useGameProgress'
import { useDictionary } from '@/features/words/DictionaryProvider'
import { useHitPoints } from '@/features/retention/hooks/useHitPoints'
import { useAds } from '@/features/ads/hooks/useAds'
import { HPBar } from '@/features/retention/components/HPBar'
import { NoLivesModal } from '@/features/retention/components/NoLivesModal'
import { BonusRuneButton } from '@/features/ads/components/BonusRuneButton'
import { LoginRewardModal } from '@/features/retention/components/LoginRewardModal'
import { useLoginRewards } from '@/features/retention/hooks/useLoginRewards'
import { getLevelConfig } from '@/features/game/utils/levelConfig'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

export default function MapScreen() {
  const { city } = useLocalSearchParams<{ city?: string }>()
  const { progress, loading, isLevelUnlocked, getLevelStars } = useGameProgress()
  const { ready } = useDictionary()
  const { hp, maxHp, lastHpRegen, spendHP, restoreHP, reload: reloadHP } = useHitPoints()
  const { rewardedReady, tryShowRewarded } = useAds()
  const { language } = useLanguage()
  const { canClaim, todayReward, currentDay, claimReward } = useLoginRewards()

  const cityParamHandled = useRef(false)
  const [activeCity, setActiveCity] = useState<CityId>(
    city === 'hollow' ? 'hollow' : 'thornwall',
  )
  const [noLivesVisible, setNoLivesVisible] = useState(false)
  const [loginRewardVisible, setLoginRewardVisible] = useState(false)

  const hollowUnlocked = progress.levels[50]?.completed === true

  useFocusEffect(
    useCallback(() => {
      reloadHP()
      if (canClaim) {
        setLoginRewardVisible(true)
      }
      if (city === 'hollow' && hollowUnlocked && !cityParamHandled.current) {
        cityParamHandled.current = true
        setActiveCity('hollow')
      }
    }, [reloadHP, canClaim, city, hollowUnlocked]),
  )

  const handleSelectLevel = useCallback(async (levelId: number) => {
    if (!isLevelUnlocked(levelId) || !ready) return

    // Star gate check
    const config = getLevelConfig(levelId, language)
    if (config.starGateRequirement && progress.totalStars < config.starGateRequirement) {
      return
    }

    // HP check
    if (hp <= 0) {
      setNoLivesVisible(true)
      return
    }

    const spent = await spendHP()
    if (!spent) {
      setNoLivesVisible(true)
      return
    }

    router.push(`/level/${levelId}`)
  }, [isLevelUnlocked, ready, language, progress.totalStars, hp, spendHP])

  const handleWatchAdForLife = useCallback(async () => {
    const rewarded = await tryShowRewarded('restoreLife')
    if (rewarded) {
      await restoreHP(1)
      setNoLivesVisible(false)
    }
  }, [tryShowRewarded, restoreHP])

  const handleClaimLoginReward = useCallback(async () => {
    await claimReward()
    setLoginRewardVisible(false)
  }, [claimReward])

  const handleCloseNoLives = useCallback(() => setNoLivesVisible(false), [])
  const handleCloseLoginReward = useCallback(() => setLoginRewardVisible(false), [])

  const handleSwitchCity = useCallback((cityId: CityId) => {
    setActiveCity(cityId)
  }, [])

  const handleGoToHollow = useCallback(() => {
    setActiveCity('hollow')
  }, [])

  if (loading || !ready) {
    return (
      <GradientBackground zone="grimoire">
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.thornwall.secondary} />
        </View>
      </GradientBackground>
    )
  }

  const cityConfig = CITY_CONFIGS[activeCity]
  const bgZone = activeCity === 'hollow' ? 'hollow' as const : 'grimoire' as const

  return (
    <GradientBackground zone={bgZone}>
      <View style={styles.header}>
        <HPBar hp={hp} maxHp={maxHp} lastHpRegen={lastHpRegen} />
        <BonusRuneButton />
      </View>
      <CitySwitcher
        activeCity={activeCity}
        hollowUnlocked={hollowUnlocked}
        onSwitch={handleSwitchCity}
      />
      <CampaignMap
        currentLevel={progress.currentLevel}
        getLevelStars={getLevelStars}
        isLevelUnlocked={isLevelUnlocked}
        onSelectLevel={handleSelectLevel}
        totalStars={progress.totalStars}
        cityConfig={cityConfig}
        onGoToHollow={activeCity === 'thornwall' && hollowUnlocked ? handleGoToHollow : undefined}
      />
      <NoLivesModal
        visible={noLivesVisible}
        lastHpRegen={lastHpRegen}
        rewardedReady={rewardedReady}
        onWatchAd={handleWatchAdForLife}
        onClose={handleCloseNoLives}
      />
      <LoginRewardModal
        visible={loginRewardVisible}
        currentDay={currentDay}
        todayReward={todayReward}
        onClaim={handleClaimLoginReward}
        onClose={handleCloseLoginReward}
      />
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 4,
    zIndex: 10,
  },
})
