import React from 'react'
import Svg, { Line, Circle } from 'react-native-svg'
import type { GridPosition } from '@/shared/types'
import type { CellLayout } from '@/features/grid/hooks/useCellPositions'
import { COLORS } from '@/shared/constants'

interface SwipePathProps {
  readonly selectedCells: readonly GridPosition[]
  readonly positions: Map<string, CellLayout>
  readonly width: number
  readonly height: number
  readonly isDark?: boolean
}

export function SwipePath({
  selectedCells,
  positions,
  width,
  height,
  isDark = false,
}: SwipePathProps) {
  if (selectedCells.length < 1) return null

  const color = isDark ? COLORS.hollow.accent : COLORS.thornwall.accent

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      {selectedCells.map((cell, index) => {
        if (index === 0) return null
        const prev = selectedCells[index - 1]
        const prevLayout = positions.get(`${prev.row},${prev.col}`)
        const currLayout = positions.get(`${cell.row},${cell.col}`)
        if (!prevLayout || !currLayout) return null

        return (
          <Line
            key={`line-${index}`}
            x1={prevLayout.centerX}
            y1={prevLayout.centerY}
            x2={currLayout.centerX}
            y2={currLayout.centerY}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.7}
          />
        )
      })}
      {selectedCells.map((cell) => {
        const layout = positions.get(`${cell.row},${cell.col}`)
        if (!layout) return null
        return (
          <Circle
            key={`dot-${cell.row}-${cell.col}`}
            cx={layout.centerX}
            cy={layout.centerY}
            r={5}
            fill={color}
            opacity={0.6}
          />
        )
      })}
    </Svg>
  )
}
