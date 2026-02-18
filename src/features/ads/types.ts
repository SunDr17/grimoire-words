export interface AdState {
  readonly adsDisabled: boolean
  readonly levelsCompletedSinceAd: number
  readonly totalAdsWatched: number
}

export function createDefaultAdState(): AdState {
  return {
    adsDisabled: false,
    levelsCompletedSinceAd: 0,
    totalAdsWatched: 0,
  }
}
