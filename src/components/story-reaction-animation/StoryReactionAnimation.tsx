import React, { useEffect, useRef, useMemo } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/dimensions';
import { Text } from '../text';

export const HEIGHT = SCREEN_HEIGHT * 0.5;
export const ANIMATION_START_Y = SCREEN_HEIGHT * 0.4;
export const ANIMATION_END_Y = 0;

const generateNumberInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export type TStoryReactionAnimationProps = {
  emoji: string;
  emojiSize?: number;
  emojisCount?: number;
  duration?: number;
  onAnimationComplete: () => void;
};

export const StoryReactionAnimation = ({
  emoji,
  emojiSize = 20,
  emojisCount = 30,
  duration = 1500,
  onAnimationComplete,
}: TStoryReactionAnimationProps) => {
  const translateY = useRef(new Animated.Value(ANIMATION_START_Y)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: ANIMATION_END_Y,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: duration / 3,
        delay: (duration * 2) / 3,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onAnimationComplete();
      }
    });
  }, [translateY, opacity, duration, onAnimationComplete]);

  const emojis = useMemo(() => {
    const scaleIncrement = 1 / emojisCount;
    const botomOffsetIncrement = HEIGHT / emojisCount;

    return [...Array(emojisCount)].map((_, i) => {
      const scale = 2 - scaleIncrement * i;
      const extraRadiusFromScale = (emojiSize * (scale - 1)) / 2;
      const bottom =
        emojiSize + extraRadiusFromScale + botomOffsetIncrement * i;
      const left = generateNumberInRange(
        extraRadiusFromScale,
        SCREEN_WIDTH - emojiSize - extraRadiusFromScale,
      );

      return (
        <Emoji
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          bottom={bottom}
          left={left}
          scale={scale}
          size={emojiSize}
        >
          {emoji}
        </Emoji>
      );
    });
  }, [emoji, emojiSize, emojisCount]);

  return (
    <Container style={{ transform: [{ translateY }], opacity }}>
      {emojis}
    </Container>
  );
};

const Container = styled(Animated.View)`
  width: ${SCREEN_WIDTH}px;
  height: ${HEIGHT}px;
`;

const Emoji = styled(Text)<{
  bottom: number;
  left: number;
  scale: number;
  size: number;
}>`
  position: absolute;
  ${({ bottom, left, scale, size }) => `
    font-size: ${size}px;
    bottom: ${bottom}px;
    left: ${left}px;
    transform: scale(${scale});
  `}
`;
