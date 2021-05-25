import React, { useEffect, useRef } from 'react';
import { ViewProps, Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

export type TSliderPageCounterProps = {
  total: number;
  current: number;
  style?: ViewProps['style'];
};

export const DELAY = 5000;

export const SliderPageIndicator = ({
  total,
  current,
}: TSliderPageCounterProps): JSX.Element => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;
  const initialPage = useRef(current).current;
  const hasChangedPageRef = useRef(false);

  useEffect(() => {
    if (current !== initialPage && !hasChangedPageRef.current) {
      hasChangedPageRef.current = true;
    }
  }, [current, initialPage]);

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
    ];
    if (hasChangedPageRef.current) {
      animations.push(
        Animated.timing(opacity, {
          toValue: 0,
          duration: theme.animation.timingSlow,
          delay: DELAY,
          useNativeDriver: true,
        }),
      );
    }

    Animated.sequence(animations).start();
  }, [current, opacity, theme.animation.timingSlow]);

  return (
    <MediaCounterTag style={{ opacity }}>
      {current}/{total}
    </MediaCounterTag>
  );
};

const MediaCounterTag = styled(Animated.Text)`
  position: absolute;
  z-index: 1;
  ${({ theme: { spacing, color } }) => `
    top: ${spacing.m};
    right: ${spacing.m};
    padding: ${spacing.xs} ${spacing.s};
    border-radius: 99px;
    color: ${color.white};
    background-color: ${color.black}E6;
  `}
`;
