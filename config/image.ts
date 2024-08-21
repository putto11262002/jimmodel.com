export const imageDim = {
  square: {
    sm: { width: 150, height: 150 },
    md: { width: 400, height: 400 },
    lg: { width: 1000, height: 1000 },
  },
  portrait: {
    sm: { width: 200, height: 300 },
    md: { width: 400, height: 600 },
    lg: { width: 800, height: 1200 },
  },
  landscape: {
    sm: { width: 300, height: 200 },
    md: { width: 600, height: 400 },
    lg: { width: 1200, height: 800 },
  },
} as const;
