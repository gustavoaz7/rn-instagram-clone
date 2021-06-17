import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../text';
import { TOwner } from '../../types';
import { THomeStackNavigationProps } from '../../navigation/HomeStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { AvatarWithRing } from '../avatar-with-ring';

export const SCALE_DURATION = 150;

export type TStoryPreviewItemProps = {
  owner: TOwner;
  style?: ViewProps['style'];
};

export function StoryPreviewItem({
  owner,
  style,
}: TStoryPreviewItemProps): JSX.Element {
  const [isPressing, setIsPressing] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<THomeStackNavigationProps>();

  const handlePressIn = useCallback(() => {
    setIsPressing(true);
  }, []);
  const handlePressOut = useCallback(() => {
    setIsPressing(false);
  }, []);
  const handlePress = useCallback(() => {
    navigation.navigate(ROOT_STACK_SCREENS.STORY, { username: owner.username });
  }, [navigation, owner.username]);

  useEffect(() => {
    Animated.timing(scale, {
      toValue: isPressing ? 0.9 : 1,
      duration: SCALE_DURATION,
      useNativeDriver: true,
    }).start();
  }, [isPressing, scale]);

  return (
    <Container
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={style}
      testID="StoryPreviewItem"
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <AvatarWithRing
          size={74}
          offset={3}
          imageUrl={owner.profilePicUrl}
          ringWidth={2}
          color="gradient"
        />
      </Animated.View>
      <Text numberOfLines={1}>{owner.username}</Text>
    </Container>
  );
}

const Container = styled.Pressable`
  align-items: center;
  width: 76px;
`;
