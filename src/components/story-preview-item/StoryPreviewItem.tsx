import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { Text } from '../text';

export const SCALE_DURATION = 150;

export function StoryPreviewItem(): JSX.Element {
  const [isPressing, setIsPressing] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: isPressing ? 0.9 : 1,
      duration: SCALE_DURATION,
      useNativeDriver: true,
    }).start();
  }, [isPressing, scale]);

  return (
    <Container
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
    >
      <RingContainer style={{ transform: [{ scale }] }}>
        <StatusRing>
          <AvatarContainer>
            <Avatar
              source={{
                uri: 'https://cdn.fakercloud.com/avatars/spbroma_128.jpg',
              }}
            />
          </AvatarContainer>
        </StatusRing>
      </RingContainer>
      <Text numberOfLines={1}>veryLongNameHere</Text>
    </Container>
  );
}

const Container = styled.Pressable`
  align-items: center;
  width: 76px;
`;

const RingContainer = styled(Animated.View)`
  position: relative;
  height: 74px;
  width: 74px;
  border-radius: 74px;
  overflow: hidden;
`;

const StatusRing = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.color.purpleRed, theme.color.yellow],
  start: { x: 0.7, y: 0.3 },
  end: { x: 0.3, y: 0.7 },
}))`
  width: 100%;
  height: 100%;
`;

const AvatarContainer = styled.View`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 70px;
  height: 70px;
  border-radius: 70px;
  background-color: ${({ theme }) => theme.color.white};
`;

const Avatar = styled.Image`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 64px;
  height: 64px;
  border-radius: 64px;
`;
