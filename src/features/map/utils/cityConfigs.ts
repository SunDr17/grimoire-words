import type { CityId } from '@/shared/types'
import type { MapLocation } from './thornwallLocations'
import { THORNWALL_LOCATIONS } from './thornwallLocations'
import { HOLLOW_LOCATIONS } from './hollowLocations'

import MAP_BG_THORNWALL from '../../../../assets/images/map-bg.png'
import MAP_BG_HOLLOW from '../../../../assets/images/map-bg-2.png'

type GradientZone = 'thornwall' | 'hollow' | 'grimoire'

export interface CityConfig {
  readonly id: CityId
  readonly titleKey: string
  readonly subtitleKey: string
  readonly loreKey: string
  readonly footerKey: string
  readonly levelRange: readonly [number, number]
  readonly locations: readonly MapLocation[]
  readonly mapBackground: number
  readonly zone: GradientZone
  readonly bossGlowColor: string
  readonly accentColor: string
  readonly completedColor: string
}

export const CITY_CONFIGS: Readonly<Record<CityId, CityConfig>> = {
  thornwall: {
    id: 'thornwall',
    titleKey: 'map.title',
    subtitleKey: 'map.subtitle',
    loreKey: 'map.lore',
    footerKey: 'map.footer',
    levelRange: [1, 50],
    locations: THORNWALL_LOCATIONS,
    mapBackground: MAP_BG_THORNWALL,
    zone: 'grimoire',
    bossGlowColor: '#FF0000',
    accentColor: '#DAA520',
    completedColor: '#DAA520',
  },
  hollow: {
    id: 'hollow',
    titleKey: 'map.hollow.title',
    subtitleKey: 'map.hollow.subtitle',
    loreKey: 'map.hollow.lore',
    footerKey: 'map.hollow.footer',
    levelRange: [51, 100],
    locations: HOLLOW_LOCATIONS,
    mapBackground: MAP_BG_HOLLOW,
    zone: 'hollow',
    bossGlowColor: '#00FFFF',
    accentColor: '#CC0000',
    completedColor: '#CC0000',
  },
}

export function getCityForLevel(levelId: number): CityId {
  if (levelId >= 51 && levelId <= 100) return 'hollow'
  return 'thornwall'
}
