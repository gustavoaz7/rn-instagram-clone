import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItem,
} from 'react-native';
import { TStory } from '../../types';
import { SCREEN_WIDTH } from '../../utils/dimensions';

import { StoryItem } from '../story-item';

type TStoriesSliderProps = {
  stories: TStory[];
  initialStoryIndex?: number;
};

export const StoriesSlider = ({
  stories,
  initialStoryIndex = 0,
}: TStoriesSliderProps): JSX.Element => {
  const navigation = useNavigation();
  const sliderRef = useRef<FlatList>(null);
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
  const [shouldPauseAnimations, setShouldPauseAnimations] = useState(false);

  const handleScrollBegin = useCallback(() => {
    setShouldPauseAnimations(true);
  }, []);

  const handleScrollMomentumEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setShouldPauseAnimations(false);
      const nextStoryIndex = Math.floor(x / SCREEN_WIDTH);
      setStoryIndex(nextStoryIndex);
    },
    [],
  );

  const handleGoToStory = useCallback(
    (nextStoryIndex: number) => {
      if (nextStoryIndex >= stories.length || nextStoryIndex < 0) {
        navigation.goBack();
        return;
      }

      setStoryIndex(nextStoryIndex);
      sliderRef.current?.scrollToIndex({
        index: nextStoryIndex,
        animated: true,
      });
    },
    [navigation, stories.length],
  );

  const renderItem = useCallback<ListRenderItem<TStory>>(
    ({ item: story, index: i }) => (
      <StoryItem
        key={story.id}
        story={story}
        storyIndex={i}
        initialMediaIndex={0}
        isCurrentStory={i === storyIndex}
        shouldPauseAnimations={shouldPauseAnimations}
        goToStory={handleGoToStory}
      />
    ),
    [storyIndex, shouldPauseAnimations, handleGoToStory],
  );

  const getItemLayout = useCallback<
    Required<FlatListProps<TStory>>['getItemLayout']
  >(
    (_, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <FlatList
      ref={sliderRef}
      initialScrollIndex={initialStoryIndex}
      getItemLayout={getItemLayout}
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      pagingEnabled
      onScrollBeginDrag={handleScrollBegin}
      onMomentumScrollEnd={handleScrollMomentumEnd}
      data={stories}
      renderItem={renderItem}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={3}
      keyboardShouldPersistTaps="handled"
    />
  );
};
