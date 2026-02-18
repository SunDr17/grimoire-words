import React, { useRef, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import type { GridPosition, GridSize, CellState } from '@/shared/types'
import { COLORS, LAYOUT } from '@/shared/constants'
import { positionKey } from '@/features/grid/utils/adjacency'
import { useCellPositions } from '@/features/grid/hooks/useCellPositions'
import { useGridGesture } from '@/features/grid/hooks/useGridGesture'
import { useLetterSelection } from '@/features/grid/hooks/useLetterSelection'
import { LetterCell } from './LetterCell'
import { SwipePath } from './SwipePath'

interface LetterGridProps {
  readonly grid: readonly (readonly string[])[]
  readonly gridSize: GridSize
  readonly selectedCells: readonly GridPosition[]
  readonly decayedCells: ReadonlySet<string>
  readonly hiddenCells: ReadonlySet<string>
  readonly hintCells?: ReadonlySet<string>
  readonly goldenCells?: ReadonlySet<string>
  readonly lightColors: readonly string[]
  readonly onSelect: (position: GridPosition) => void
  readonly onDeselect: () => void
  readonly onClear: () => void
  readonly onSubmit: () => void
  readonly enabled: boolean
  readonly isDark?: boolean
}

export const LetterGrid = React.memo(function LetterGrid({
  grid,
  gridSize,
  selectedCells,
  decayedCells,
  hiddenCells,
  hintCells,
  goldenCells,
  lightColors,
  onSelect,
  onDeselect,
  onClear,
  onSubmit,
  enabled,
  isDark = false,
}: LetterGridProps) {
  const gridViewRef = useRef<View>(null)
  const { positions, cellSize, gridWidth } = useCellPositions(gridSize)

  const { handleCellHit, handleSwipeEnd } = useLetterSelection({
    onSelect,
    onDeselect,
    onClear,
    selectedCells,
    decayedCells,
    hiddenCells,
  })

  const handleSubmit = useCallback(() => {
    handleSwipeEnd()
    onSubmit()
  }, [handleSwipeEnd, onSubmit])

  const gesture = useGridGesture({
    positions,
    gridSize,
    gridOffsetY: 0,
    onCellHit: handleCellHit,
    onSwipeEnd: handleSwipeEnd,
    onSubmit: handleSubmit,
    enabled,
  })

  const getCellState = useCallback(
    (row: number, col: number): CellState => {
      const key = positionKey({ row, col })
      if (decayedCells.has(key)) return 'decayed'
      if (hiddenCells.has(key)) return 'hidden'
      if (selectedCells.some((c) => c.row === row && c.col === col)) {
        return 'selected'
      }
      if (hintCells?.has(key)) return 'hint'
      return 'idle'
    },
    [selectedCells, decayedCells, hiddenCells, hintCells],
  )

  const gridHeight = gridSize * (cellSize + 16 + LAYOUT.gridGap) - LAYOUT.gridGap

  return (
    <GestureDetector gesture={gesture}>
      <View
        ref={gridViewRef}
        style={[
          styles.container,
          {
            width: gridWidth + LAYOUT.gridPadding,
            height: gridHeight + LAYOUT.gridPadding,
          },
        ]}
      >
        <SwipePath
          selectedCells={selectedCells}
          positions={positions}
          width={gridWidth + LAYOUT.gridPadding}
          height={gridHeight + LAYOUT.gridPadding}
          isDark={isDark}
        />
        <View style={[styles.gridInner, { width: gridWidth }]}>
          {Array.from({ length: gridSize }, (_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: gridSize }, (_, col) => {
                const cellIndex = row * gridSize + col
                return (
                  <LetterCell
                    key={`${row}-${col}`}
                    letter={grid[row][col]}
                    lightColor={lightColors[cellIndex % lightColors.length]}
                    cellSize={cellSize}
                    state={getCellState(row, col)}
                    isDark={isDark}
                    isGolden={goldenCells?.has(positionKey({ row, col })) ?? false}
                  />
                )
              })}
            </View>
          ))}
        </View>
      </View>
    </GestureDetector>
  )
})

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    padding: LAYOUT.gridPadding / 2,
  },
  gridInner: {
    gap: LAYOUT.gridGap,
  },
  row: {
    flexDirection: 'row',
    gap: LAYOUT.gridGap,
  },
})
