import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  MaxAdContentRating,
  mobileAds,
} from 'react-native-google-mobile-ads'
import { AD_UNIT_IDS, AD_FREQUENCY } from '../constants'
import type { AdState } from '../types'
import { createDefaultAdState } from '../types'
import { getAdState, saveAdState } from '@/persistence/storage'

const CHILD_AD_REQUEST_OPTIONS = {
  requestNonPersonalizedAdsOnly: true,
}

let interstitialAd: InterstitialAd | null = null
let rewardedAd: RewardedAd | null = null
let adState: AdState = createDefaultAdState()
let initialized = false

function loadInterstitial(): void {
  if (adState.adsDisabled) return
  interstitialAd = InterstitialAd.createForAdRequest(
    AD_UNIT_IDS.interstitial,
    CHILD_AD_REQUEST_OPTIONS,
  )
  interstitialAd.load()
}

function loadRewarded(): void {
  if (adState.adsDisabled) return
  rewardedAd = RewardedAd.createForAdRequest(
    AD_UNIT_IDS.rewarded,
    CHILD_AD_REQUEST_OPTIONS,
  )
  rewardedAd.load()
}

export async function initializeAds(): Promise<void> {
  if (initialized) return
  initialized = true

  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.T,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  })

  await mobileAds().initialize()

  adState = await getAdState()

  if (!adState.adsDisabled) {
    loadInterstitial()
    loadRewarded()
  }
}

export function getAdsDisabled(): boolean {
  return adState.adsDisabled
}

export function isRewardedAdReady(): boolean {
  if (adState.adsDisabled) return true
  return rewardedAd?.loaded ?? false
}

export async function incrementLevelCounter(): Promise<void> {
  adState = {
    ...adState,
    levelsCompletedSinceAd: adState.levelsCompletedSinceAd + 1,
  }
  await saveAdState(adState)
}

export function shouldShowInterstitial(): boolean {
  if (adState.adsDisabled) return false
  return adState.levelsCompletedSinceAd >= AD_FREQUENCY.interstitialEveryNLevels
}

export function showInterstitial(): Promise<boolean> {
  if (adState.adsDisabled) {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    if (!interstitialAd?.loaded) {
      loadInterstitial()
      resolve(false)
      return
    }

    function cleanup() {
      unsubscribeClosed()
      unsubscribeError()
    }

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      async () => {
        cleanup()
        adState = { ...adState, levelsCompletedSinceAd: 0 }
        await saveAdState(adState)
        loadInterstitial()
        resolve(true)
      },
    )

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      () => {
        cleanup()
        loadInterstitial()
        resolve(false)
      },
    )

    interstitialAd.show()
  })
}

export function showRewarded(): Promise<boolean> {
  if (adState.adsDisabled) return Promise.resolve(true)

  return new Promise((resolve) => {
    if (!rewardedAd?.loaded) {
      loadRewarded()
      resolve(false)
      return
    }

    let rewarded = false

    function cleanup() {
      unsubscribeEarned()
      unsubscribeClosed()
      unsubscribeError()
    }

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        rewarded = true
      },
    )

    const unsubscribeClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      async () => {
        cleanup()
        if (rewarded) {
          adState = {
            ...adState,
            totalAdsWatched: adState.totalAdsWatched + 1,
          }
          await saveAdState(adState)
        }
        loadRewarded()
        resolve(rewarded)
      },
    )

    const unsubscribeError = rewardedAd.addAdEventListener(
      AdEventType.ERROR,
      () => {
        cleanup()
        loadRewarded()
        resolve(false)
      },
    )

    rewardedAd.show()
  })
}
