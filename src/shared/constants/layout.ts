import { Dimensions } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  gridPadding: 16,
  gridGap: 4,
  headerHeight: 60,
  footerHeight: 80,
} as const

// Vertical space consumed by non-grid UI in level screen:
// topBar(40) + WordPreview(50) + FoundWordsList(60) + RunePanel(80) + safe areas(~60)
const LEVEL_UI_OVERHEAD = 290
const BULB_HEIGHT = 16

// Scale factor for fixed-size UI on tablets (1.0 on phones, up to 1.5 on tablets)
const BASE_WIDTH = 375
export const UI_SCALE = Math.min(1.5, Math.max(1, SCREEN_WIDTH / BASE_WIDTH))

export function calculateCellSize(gridSize: number): number {
  // Width constraint
  const availableWidth = SCREEN_WIDTH - LAYOUT.gridPadding * 2
  const totalWidthGaps = (gridSize - 1) * LAYOUT.gridGap
  const maxByWidth = Math.floor((availableWidth - totalWidthGaps) / gridSize)

  // Height constraint — prevent grid from overflowing on tablets and small phones
  const availableHeight = SCREEN_HEIGHT - LEVEL_UI_OVERHEAD
  const totalHeightGaps = (gridSize - 1) * LAYOUT.gridGap
  const maxByHeight = Math.floor(
    (availableHeight - totalHeightGaps - gridSize * BULB_HEIGHT) / gridSize,
  )

  return Math.min(maxByWidth, maxByHeight)
}

export function calculateGridOrigin(gridSize: number): { x: number; y: number } {
  const cellSize = calculateCellSize(gridSize)
  const gridWidth = gridSize * cellSize + (gridSize - 1) * LAYOUT.gridGap
  const x = (SCREEN_WIDTH - gridWidth) / 2
  const y = LAYOUT.headerHeight + 100
  return { x, y }
}
