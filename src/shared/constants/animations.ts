export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },
  spring: {
    snappy: { damping: 15, stiffness: 200 },
    bouncy: { damping: 10, stiffness: 150 },
    gentle: { damping: 20, stiffness: 100 },
  },
  flicker: {
    minOpacity: 0.6,
    maxOpacity: 1.0,
    interval: 2000,
  },
} as const
