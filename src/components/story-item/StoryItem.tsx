import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components/native';
import {
  GestureResponderEvent,
  Animated,
  Easing,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import DirectSvg from '../../../assets/svg/direct.svg';
import MenuVerticalSvg from '../../../assets/svg/menu-vertical.svg';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/dimensions';
import { TStory } from '../../types';
import { Text } from '../text';
import { dateToString } from '../../utils/date';
import { EMOJIS } from '../../constants';

export const STORY_TIMEOUT = 5000;

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
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState('');
  const handleTextChange = useCallback(newText => {
    setText(newText);
  }, []);

  const progressBars = useRef<Animated.Value[]>(
    story.medias.map(
      (m, i) => new Animated.Value(i < initialMediaIndex ? 1 : 0),
    ),
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
      duration: STORY_TIMEOUT - (bar as any).__getValue() * STORY_TIMEOUT,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(({ finished }) => {
      if (finished) {
        goToNextMedia();
      }
    });
  }, [mediaIndex, progressBars, goToNextMedia]);

  const handleStartReplying = useCallback(() => {
    setIsReplying(true);
    stopProgressAnimation();
  }, [stopProgressAnimation]);

  const handleStopReplying = useCallback(() => {
    setIsReplying(false);
    startProgressAnimation();
  }, [startProgressAnimation]);

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

  const ReactionsHeader = useCallback(
    () => <ReactionsTitle>Quick reactions</ReactionsTitle>,
    [],
  );
  const keyExtractor = useCallback((k: string) => k, []);
  const ReactionsRenderItem = useCallback<ListRenderItem<string>>(
    ({ item }) => (
      <EmojiContainer
        onPress={() => {
          handleStopReplying();
        }}
      >
        <Emoji>{item}</Emoji>
      </EmojiContainer>
    ),
    [handleStopReplying],
  );

  const currentMedia = story.medias[mediaIndex];

  return (
    <>
      <Container
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        delayLongPress={200}
        testID="StoryItem"
      >
        <Image testID="StoryItem-Image" source={{ uri: currentMedia.url }} />
        <ProgressBarContainer testID="StoryItem-ProgressBar">
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
      </Container>
      {isReplying ? (
        <ReplyContainer>
          {!text ? (
            <FlatList
              data={EMOJIS}
              ListHeaderComponent={ReactionsHeader}
              renderItem={ReactionsRenderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.reactionsList}
              numColumns={4}
              keyboardShouldPersistTaps="handled"
            />
          ) : null}
        </ReplyContainer>
      ) : null}
      <Footer>
        {!isReplying ? (
          <>
            <FakeInput
              onPress={handleStartReplying}
              testID="StoryItem-FakeInput"
            >
              <FakePlaceholder>Send message</FakePlaceholder>
            </FakeInput>
            <DirectIcon />
          </>
        ) : (
          <Input
            value={text}
            autoFocus
            onChangeText={handleTextChange}
            onBlur={handleStopReplying}
          />
        )}
      </Footer>
    </>
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
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
`;

const FakeInput = styled.Pressable`
  flex: 1;
  border-radius: 25px;
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.white}80;
`;

const FakePlaceholder = styled(Text)`
  color: ${({ theme }) => theme.color.white};
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholder: 'Send message',
  placeholderTextColor: theme.color.white,
  multiline: true,
}))`
  z-index: 1;
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

const ReplyContainer = styled.View`
  ${StyleSheet.absoluteFill};
  background-color: ${({ theme }) => theme.color.black}80;
  flex-direction: row;
  align-items: center;
`;

const ReactionsTitle = styled(Text)`
  color: ${({ theme }) => theme.color.white};
  opacity: 0.7;
  align-self: center;
`;

const EmojiContainer = styled.Pressable`
  flex: 1;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.s};
  z-index: 9;
`;

const Emoji = styled(Text)`
  font-size: ${(SCREEN_WIDTH * 0.6) / EMOJIS.length}px;
`;

const styles = StyleSheet.create({
  reactionsList: {
    alignSelf: 'center',
    width: '60%',
  },
});
