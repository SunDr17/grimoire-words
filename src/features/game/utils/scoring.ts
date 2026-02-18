import { scoreWord } from '@/features/board/utils/boardSolver'
import type { StarRating } from '@/shared/types'

export { scoreWord }

export function calculateStarRating(
  score: number,
  targetScore: number,
  bonusComplete: boolean,
): StarRating {
  const primaryComplete = score >= targetScore

  if (bonusComplete && primaryComplete) {
    return { stars: 3, primaryComplete, bonusComplete }
  }

  if (primaryComplete && score >= targetScore * 1.5) {
    return { stars: 2, primaryComplete, bonusComplete: false }
  }

  if (primaryComplete) {
    return { stars: 1, primaryComplete, bonusComplete: false }
  }

  return { stars: 1, primaryComplete: false, bonusComplete: false }
}
