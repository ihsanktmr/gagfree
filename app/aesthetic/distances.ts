export const distances = {
  xxxxs: 2,
  xxxs: 4,
  xxs: 6,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type Distance = keyof typeof distances;
