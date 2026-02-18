import { Platform } from 'react-native'

const TEST_INTERSTITIAL_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
}) as string

const TEST_REWARDED_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/1712485313',
  android: 'ca-app-pub-3940256099942544/5224354917',
}) as string

const PROD_INTERSTITIAL_ID = Platform.select({
  ios: 'ca-app-pub-1326375857154070/4215820718',
  android: 'ca-app-pub-1326375857154070/1251348668',
}) as string

const PROD_REWARDED_ID = Platform.select({
  ios: 'ca-app-pub-1326375857154070/5086873665',
  android: 'ca-app-pub-1326375857154070/4011032500',
}) as string

const IS_PROD = !__DEV__

export const AD_UNIT_IDS = {
  interstitial: IS_PROD ? PROD_INTERSTITIAL_ID : TEST_INTERSTITIAL_ID,
  rewarded: IS_PROD ? PROD_REWARDED_ID : TEST_REWARDED_ID,
} as const

export const AD_FREQUENCY = {
  interstitialEveryNLevels: 3,
} as const

export type AdPlacement =
  | 'continue'
  | 'doubleScore'
  | 'bonusRune'
  | 'restoreLife'
  | 'dailyMultiplier'
