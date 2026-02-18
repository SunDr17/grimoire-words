import { useState, useEffect, useCallback } from 'react'
import {
  getAdsDisabled,
  isRewardedAdReady,
  showInterstitial,
  showRewarded,
  incrementLevelCounter,
  shouldShowInterstitial,
} from '../services/adService'
import type { AdPlacement } from '../constants'

export function useAds() {
  const [adsDisabled, setAdsDisabled] = useState(false)
  const [rewardedReady, setRewardedReady] = useState(false)

  useEffect(() => {
    setAdsDisabled(getAdsDisabled())

    const interval = setInterval(() => {
      setRewardedReady(isRewardedAdReady())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const tryShowInterstitial = useCallback(async (): Promise<boolean> => {
    if (adsDisabled) return false
    if (!shouldShowInterstitial()) return false
    return showInterstitial()
  }, [adsDisabled])

  const tryShowRewarded = useCallback(
    async (_placement: AdPlacement): Promise<boolean> => {
      return showRewarded()
    },
    [],
  )

  const trackLevelComplete = useCallback(async (): Promise<void> => {
    await incrementLevelCounter()
  }, [])

  return {
    adsDisabled,
    rewardedReady,
    tryShowInterstitial,
    tryShowRewarded,
    trackLevelComplete,
  }
}
