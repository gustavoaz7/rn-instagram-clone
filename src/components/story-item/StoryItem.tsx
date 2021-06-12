import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components/native';
import { GestureResponderEvent, Animated } from 'react-native';
import DirectSvg from '../../../assets/svg/direct.svg';
import MenuVerticalSvg from '../../../assets/svg/menu-vertical.svg';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/dimensions';
import { TStory } from '../../types';
import { Text } from '../text';
import { dateToString } from '../../utils/date';

type TStoryItemProps = {
  story: TStory;
  storyIndex: number;
  isCurrentStory: boolean;
  initialMediaIndex?: number;
  shouldPauseAnimations?: boolean;
  goToStory: (nextStoryIndex: number) => void;
};

export const StoryItem = ({
  story,
  storyIndex,
  isCurrentStory,
  initialMediaIndex = 0,
  shouldPauseAnimations = false,
  goToStory,
}: TStoryItemProps) => {
  const [mediaIndex, setMediaIndex] = useState(initialMediaIndex);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [text, setText] = useState('');
  const handleTextChange = useCallback(newText => {
    setText(newText);
  }, []);

  const progressBars = useRef<Animated.Value[]>(
    story.medias.map(() => new Animated.Value(0)),
  ).current;

  const stopProgressAnimation = useCallback(() => {
    progressBars[mediaIndex].stopAnimation();
  }, [progressBars, mediaIndex]);

  const goToPrevMedia = useCallback(() => {
    progressBars[mediaIndex].setValue(0);
    if (mediaIndex > 0) {
      progressBars[mediaIndex - 1].setValue(0);
      setMediaIndex(mediaIndex - 1);
    } else {
      goToStory(storyIndex - 1);
    }
  }, [mediaIndex, goToStory, storyIndex, progressBars]);

  const goToNextMedia = useCallback(() => {
    if (mediaIndex < story.medias.length - 1) {
      setMediaIndex(mediaIndex + 1);
    } else {
      const bar = progressBars[mediaIndex];
      bar.setValue(0);
      goToStory(storyIndex + 1);
    }
  }, [mediaIndex, goToStory, storyIndex, story.medias.length, progressBars]);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      stopProgressAnimation();
      const bar = progressBars[mediaIndex];
      if (e.nativeEvent.locationX < SCREEN_WIDTH / 2) {
        bar.setValue(0);
        goToPrevMedia();
      } else {
        bar.setValue(1);
        goToNextMedia();
      }
    },
    [
      stopProgressAnimation,
      progressBars,
      mediaIndex,
      goToPrevMedia,
      goToNextMedia,
    ],
  );

  const startProgressAnimation = useCallback(() => {
    const bar = progressBars[mediaIndex];
    Animated.timing(bar, {
      toValue: 1,
      // Adjusts duration when re-starting after stop animation
      // eslint-disable-next-line
      duration: 5000 - (bar as any).__getValue() * 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNextMedia();
      }
    });
  }, [mediaIndex, progressBars, goToNextMedia]);

  useEffect(() => {
    if (isCurrentStory && !shouldPauseAnimations) {
      startProgressAnimation();
    } else {
      if (!shouldPauseAnimations) {
        progressBars[mediaIndex].setValue(0);
      }
      stopProgressAnimation();
    }
  }, [
    mediaIndex,
    isCurrentStory,
    progressBars,
    shouldPauseAnimations,
    startProgressAnimation,
    stopProgressAnimation,
  ]);

  useEffect(() => {
    if (shouldPauseAnimations || isAnimationPaused) {
      stopProgressAnimation();
    }
  }, [shouldPauseAnimations, isAnimationPaused, stopProgressAnimation]);

  const handleLongPress = useCallback(() => {
    setIsAnimationPaused(true);
  }, [setIsAnimationPaused]);

  const handlePressOut = useCallback(() => {
    if (isAnimationPaused) {
      startProgressAnimation();
    }
    setIsAnimationPaused(false);
  }, [setIsAnimationPaused, isAnimationPaused, startProgressAnimation]);

  const currentMedia = story.medias[mediaIndex];

  return (
    <Container
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressOut={handlePressOut}
      delayLongPress={200}
    >
      <Image source={{ uri: currentMedia.url }} />
      <ProgressBarContainer>
        {story.medias.map((_, i) => (
          <ProgressBarItem
            // eslint-disable-next-line react/no-array-index-key
            key={`bar-${i}`}
          >
            <ProgressBarItemAnimated
              style={{
                width: progressBars[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              }}
            />
          </ProgressBarItem>
        ))}
      </ProgressBarContainer>
      <Header>
        <AvatarContainer>
          <Avatar source={{ uri: story.owner.profilePicUrl }} />
          <Username>{story.owner.username}</Username>
          <Time>{dateToString(new Date(currentMedia.takenAt), true)}</Time>
        </AvatarContainer>
        <MenuVerticalIcon />
      </Header>
      <Footer>
        <Input
          value={text}
          onChangeText={handleTextChange}
          onFocus={stopProgressAnimation}
          onBlur={startProgressAnimation}
        />
        <DirectIcon />
      </Footer>
    </Container>
  );
};

const Container = styled.Pressable`
  flex: 1;
  justify-content: space-between;
  width: ${SCREEN_WIDTH}px;
`;

const CenteredRow = styled.View`
  align-items: center;
  flex-direction: row;
`;

const Header = styled(CenteredRow)`
  padding-top: ${({ theme }) => theme.spacing.s};
  justify-content: space-between;
`;

const Image = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_HEIGHT}px;
  border-radius: 5px;
`;

const AvatarContainer = styled(CenteredRow)`
  padding: ${({ theme }) => theme.spacing.m};
`;

const Avatar = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 36px;
  margin-right: ${({ theme }) => theme.spacing.s};
`;

const Username = styled(Text)`
  font-weight: bold;
  color: ${({ theme }) => theme.color.white};
`;

const Time = styled(Text)`
  color: ${({ theme }) => theme.color.white}CC;
  margin-left: ${({ theme }) => theme.spacing.s};
`;

const MenuVerticalIcon = styled(MenuVerticalSvg).attrs(({ theme }) => ({
  color: theme.color.white,
}))`
  margin-right: ${({ theme }) => theme.spacing.m};
`;

const Footer = styled(CenteredRow)`
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholder: 'Send message',
  placeholderTextColor: theme.color.white,
  multiline: true,
}))`
  flex: 1;
  border-radius: 25px;
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  max-height: 100px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.white}80;
  color: ${({ theme }) => theme.color.white};
`;

const DirectIcon = styled(DirectSvg).attrs(({ theme }) => ({
  color: theme.color.white,
}))`
  margin-left: ${({ theme }) => theme.spacing.l};
`;

const ProgressBarContainer = styled(CenteredRow)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.s};
  left: 3px;
  right: 3px;
  height: 2px;
  justify-content: space-between;
`;

const progressBarItemClass = css`
  border-radius: 2px;
  height: 100%;
  flex: 1;
`;

const ProgressBarItem = styled.View`
  ${progressBarItemClass};
  margin: 0 2px;
  background-color: ${({ theme }) => theme.color.white}80;
`;

const ProgressBarItemAnimated = styled(Animated.View)`
  ${progressBarItemClass};
  background-color: ${({ theme }) => theme.color.white};
`;
