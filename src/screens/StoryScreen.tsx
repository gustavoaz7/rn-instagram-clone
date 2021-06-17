import React from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StoriesSlider } from '../components/stories-slider';
import { TRootStackParams } from '../navigation/RootStackNavigator';
import { ROOT_STACK_SCREENS } from '../navigation/screens';
import { useStoriesSelector } from '../redux/stories';

export type StoryScreenRouteProp = RouteProp<
  TRootStackParams,
  ROOT_STACK_SCREENS.STORY
>;

export function StoryScreen(): JSX.Element {
  const route = useRoute<StoryScreenRouteProp>();
  const { id } = route.params;
  const { stories } = useStoriesSelector();

  const storyIndex = stories.findIndex(story => story.id === id);

  return (
    <Container>
      <StatusBar backgroundColor="black" barStyle="dark-content" />
      <StoriesSlider stories={stories} initialStoryIndex={storyIndex} />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: black;
`;
