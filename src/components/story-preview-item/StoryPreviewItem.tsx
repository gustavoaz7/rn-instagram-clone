import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ViewProps, Image } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../text';
import { TStory } from '../../types';
import { THomeStackNavigationProps } from '../../navigation/HomeStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { AvatarWithRing } from '../avatar-with-ring';

export const SCALE_DURATION = 150;

export type TStoryPreviewItemProps = {
  story: TStory;
  style?: ViewProps['style'];
};

export function StoryPreviewItem({
  story,
  style,
}: TStoryPreviewItemProps): JSX.Element {
  const [isPressing, setIsPressing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<THomeStackNavigationProps>();

  const handlePressIn = useCallback(() => {
    setIsPressing(true);
  }, []);
  const handlePressOut = useCallback(() => {
    setIsPressing(false);
  }, []);
  const handlePress = useCallback(async () => {
    setIsLoading(true);
    await Promise.all(story.medias.map(media => Image.prefetch(media.url)));
    setIsLoading(false);
    navigation.navigate(ROOT_STACK_SCREENS.STORY, { id: story.id });
  }, [navigation, story]);

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
          imageUrl={story.owner.profilePicUrl}
          ringWidth={2}
          color="gradient"
          loading={isLoading}
        />
      </Animated.View>
      <Text numberOfLines={1}>{story.owner.username}</Text>
    </Container>
  );
}

const Container = styled.Pressable`
  align-items: center;
  width: 76px;
`;
