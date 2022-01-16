import type { Animated } from 'react-native';

const HEART_SPRING_SCALE_CONFIG: Animated.SpringAnimationConfig = {
  toValue: 1,
  useNativeDriver: true,
  velocity: 5,
  tension: 100,
  friction: 5,
};

export enum THEME_VARIANTS {
  LIGHT = 'light',
  DARK = 'dark',
}

export type TTheme = {
  spacing: {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
  };
  color: {
    lightBlue: string;
    royalBlue: string;
    blue: string;
    purple: string;
    darkPink: string;
    purpleRed: string;
    red: string;
    darkOrange: string;
    orange: string;
    yellow: string;
    lightYellow: string;
    white: string;
    black: string;
    gray: string;
    foreground: string;
    background: string;
  };
  font: {
    size: {
      s: string;
      m: string;
      l: string;
      xl: string;
    };
  };
  animation: {
    timingFast: number;
    timingBase: number;
    timingSlow: number;
    heart: {
      initialScale: number;
      springConfig: Animated.SpringAnimationConfig;
    };
  };
};

const defaultSpacing: TTheme['spacing'] = {
  xs: '5px',
  s: '10px',
  m: '15px',
  l: '20px',
  xl: '25px',
};

const defaultColors: Omit<TTheme['color'], 'foreground' | 'background'> = {
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
  black: '#020202',
  gray: '#8e8e8e',
};

const defaultFont: TTheme['font'] = {
  size: {
    s: '12px',
    m: '14px',
    l: '16px',
    xl: '20px',
  },
};

const defaultAnimation: TTheme['animation'] = {
  timingFast: 150,
  timingBase: 300,
  timingSlow: 500,
  heart: {
    initialScale: 0.3,
    springConfig: HEART_SPRING_SCALE_CONFIG,
  },
};

export const theme: Record<THEME_VARIANTS, TTheme> = {
  [THEME_VARIANTS.LIGHT]: {
    spacing: defaultSpacing,
    color: {
      ...defaultColors,
      foreground: defaultColors.black,
      background: defaultColors.white,
    },
    font: defaultFont,
    animation: defaultAnimation,
  },
  [THEME_VARIANTS.DARK]: {
    spacing: defaultSpacing,
    color: {
      ...defaultColors,
      foreground: defaultColors.white,
      background: defaultColors.black,
    },
    font: defaultFont,
    animation: defaultAnimation,
  },
};
