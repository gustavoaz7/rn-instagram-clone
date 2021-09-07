import type { Animated } from 'react-native';

const HEART_SPRING_SCALE_CONFIG: Animated.SpringAnimationConfig = {
  toValue: 1,
  useNativeDriver: true,
  velocity: 5,
  tension: 100,
  friction: 5,
};

export const theme = {
  spacing: {
    xs: '5px',
    s: '10px',
    m: '15px',
    l: '20px',
    xl: '25px',
  },
  color: {
    lightBlue: '#0095f6',
    royalBlue: '#405DE6',
    blue: '#5B51D8',
    purple: '#833AB4',
    darkPink: '#C13584',
    purpleRed: '#E1306C',
    red: '#FD1D1D',
    darkOrange: '#F56040',
    orange: '#F77737',
    yellow: '#FCAF45',
    lightYellow: '#FFDC80',
    white: '#FFFFFF',
    black: '#262626',
    gray: '#8e8e8e',
  },
  font: {
    size: {
      s: '12px',
      m: '14px',
      l: '16px',
      xl: '20px',
    },
  },
  animation: {
    timingFast: 150,
    timingBase: 300,
    timingSlow: 500,

    heart: {
      initialScale: 0.3,
      springConfig: HEART_SPRING_SCALE_CONFIG,
    },
  },
};

export type TTheme = typeof theme;
