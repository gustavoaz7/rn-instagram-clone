import React, { memo, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing, StyleSheet } from 'react-native';
import styled, { css, useTheme } from 'styled-components/native';
import Svg, { Circle } from 'react-native-svg';

export type TAvatarWithRingProps = {
  size: number;
  color: string;
  imageUrl?: string;
  ringWidth?: number;
  offset?: number;
  loading?: boolean;
};

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const DASHES_COUNT = 30;

export const AvatarWithRing = memo(function AvatarWithRing({
  size,
  color,
  imageUrl,
  ringWidth = 2,
  offset = 2,
  loading = false,
}: TAvatarWithRingProps) {
  const rotateSvgDeg = useMemo(() => new Animated.Value(0), []);
  const theme = useTheme();
  const gradientColors =
    color === 'gradient'
      ? [theme.color.purpleRed, theme.color.yellow]
      : [color, color];

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateSvgDeg, {
          toValue: 1,
          duration: theme.animation.timingBase,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        { resetBeforeIteration: false },
      ).start();
    } else {
      rotateSvgDeg.setValue(0);
    }
  }, [rotateSvgDeg, theme.animation.timingBase, loading]);

  return (
    <Container size={size}>
      <GradientRing
        colors={gradientColors}
        start={{ x: 0.7, y: 0.3 }}
        end={{ x: 0.3, y: 0.7 }}
      >
        {loading ? (
          <LoadingSvg
            width={size}
            height={size}
            rotation={rotateSvgDeg.interpolate({
              inputRange: [0, 1],
              outputRange: [0, (360 / DASHES_COUNT) * 2],
            })}
          >
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2}
              fill="none"
              stroke={theme.color.white}
              strokeWidth={ringWidth * 2}
              strokeDasharray={(Math.PI * size) / DASHES_COUNT}
            />
          </LoadingSvg>
        ) : null}
        <AvatarContainer size={size} ringWidth={ringWidth}>
          <Avatar
            size={size}
            ringWidth={ringWidth}
            offset={offset}
            source={{ uri: imageUrl }}
          />
        </AvatarContainer>
      </GradientRing>
    </Container>
  );
});

const centerStyle = css`
  align-items: center;
  justify-content: center;
`;

const Container = styled.View<Pick<TAvatarWithRingProps, 'size'>>`
  position: relative;
  overflow: hidden;
  ${({ size }) => `
    height: ${size}px;
    width: ${size}px;
    border-radius: ${size}px;
  `}
`;

const GradientRing = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  ${centerStyle};
`;

const AvatarContainer = styled.View<Record<'size' | 'ringWidth', number>>`
  ${centerStyle};
  background-color: ${({ theme }) => theme.color.white};
  ${({ size, ringWidth }) => `
    height: ${size - ringWidth * 2}px;
    width: ${size - ringWidth * 2}px;
    border-radius: ${size - ringWidth * 2}px;
  `}
`;

const Avatar = styled.Image<Record<'size' | 'ringWidth' | 'offset', number>>`
  ${({ size, ringWidth, offset, theme }) => `
    height: ${size - ringWidth * 2 - offset * 2}px;
    width: ${size - ringWidth * 2 - offset * 2}px;
    border-radius: ${size - ringWidth * 2 - offset * 2}px;
    border-width: 2px;
    border-color: ${`${theme.color.black}33`};
  `}
`;

const LoadingSvg = styled(AnimatedSvg)`
  ${StyleSheet.absoluteFill};
`;
