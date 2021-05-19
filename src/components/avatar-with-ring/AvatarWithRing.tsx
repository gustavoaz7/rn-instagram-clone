import React, { memo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styled, { css, useTheme } from 'styled-components/native';

export type TAvatarWithRingProps = {
  size: number;
  color: string;
  imageUrl: string;
  ringWidth?: number;
  offset?: number;
};

export const AvatarWithRing = memo(function AvatarWithRing({
  size,
  color,
  imageUrl,
  ringWidth = 2,
  offset = 2,
}: TAvatarWithRingProps) {
  const theme = useTheme();
  const gradientColors =
    color === 'gradient'
      ? [theme.color.purpleRed, theme.color.yellow]
      : [color, color];

  return (
    <Container size={size}>
      <GradientRing
        colors={gradientColors}
        start={{ x: 0.7, y: 0.3 }}
        end={{ x: 0.3, y: 0.7 }}
      >
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
