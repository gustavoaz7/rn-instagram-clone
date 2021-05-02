import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { Text } from '../text';

export function StoryPreviewItem(): JSX.Element {
  return (
    <Container>
      <RingContainer>
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

const Container = styled.View`
  align-items: center;
  width: 76px;
`;

const RingContainer = styled.View`
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