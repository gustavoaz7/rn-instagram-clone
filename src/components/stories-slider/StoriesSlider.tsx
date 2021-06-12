import React, { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { TStory } from '../../types';
import { SCREEN_WIDTH } from '../../utils/dimensions';

import { StoryItem } from '../story-item';

type TStoriesSliderProps = {
  stories: TStory[];
};

export const StoriesSlider = ({
  stories,
}: TStoriesSliderProps): JSX.Element => {
  const sliderRef = useRef<ScrollView>(null);
  const [storyIndex, setStoryIndex] = useState(0);
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
      if (nextStoryIndex >= stories.length || nextStoryIndex <= 0) {
        // navigate back || close modal
        return;
      }

      setStoryIndex(nextStoryIndex);
      sliderRef.current?.scrollTo({
        x: nextStoryIndex * SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
    },
    [stories.length],
  );

  return (
    <ScrollView
      ref={sliderRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      pagingEnabled
      onScrollBeginDrag={handleScrollBegin}
      onMomentumScrollEnd={handleScrollMomentumEnd}
    >
      {stories.map((story, i) => (
        <StoryItem
          key={story.id}
          story={story}
          storyIndex={i}
          initialMediaIndex={0}
          isCurrentStory={i === storyIndex}
          shouldPauseAnimations={shouldPauseAnimations}
          goToStory={handleGoToStory}
        />
      ))}
    </ScrollView>
  );
};
