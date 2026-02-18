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

export function calculateCellSize(gridSize: number): number {
  const availableWidth = SCREEN_WIDTH - LAYOUT.gridPadding * 2
  const totalGaps = (gridSize - 1) * LAYOUT.gridGap
  return Math.floor((availableWidth - totalGaps) / gridSize)
}

export function calculateGridOrigin(gridSize: number): { x: number; y: number } {
  const cellSize = calculateCellSize(gridSize)
  const gridWidth = gridSize * cellSize + (gridSize - 1) * LAYOUT.gridGap
  const x = (SCREEN_WIDTH - gridWidth) / 2
  const y = LAYOUT.headerHeight + 100
  return { x, y }
}
