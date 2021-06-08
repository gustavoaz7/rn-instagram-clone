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
  isCurrentStory: boolean;
  initialMediaIndex?: number;
  onGoNext: () => void;
  onGoPrev: () => void;
};

export const StoryItem = ({
  story,
  isCurrentStory,
  initialMediaIndex = 0,
  onGoNext,
  onGoPrev,
}: TStoryItemProps) => {
  const [mediaIndex, setMediaIndex] = useState(initialMediaIndex);
  const [text, setText] = useState('');
  const handleTextChange = useCallback(newText => {
    setText(newText);
  }, []);

  const progressBars = useRef<Animated.Value[]>(
    story.medias.map(() => new Animated.Value(0)),
  );

  const goToPrevMedia = useCallback(() => {
    if (mediaIndex > 0) {
      progressBars.current?.[mediaIndex - 1].setValue(0);
      setMediaIndex(mediaIndex - 1);
    } else {
      progressBars.current?.[mediaIndex].setValue(0);
      onGoPrev();
    }
  }, [mediaIndex, onGoPrev, progressBars]);

  const goToNextMedia = useCallback(() => {
    if (mediaIndex < story.medias.length - 1) {
      setMediaIndex(mediaIndex + 1);
    } else {
      const bar = progressBars.current?.[mediaIndex];
      bar.setValue(0);
      onGoNext();
    }
  }, [mediaIndex, onGoNext, story.medias.length, progressBars]);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      const bar = progressBars.current?.[mediaIndex];
      if (e.nativeEvent.locationX < SCREEN_WIDTH / 2) {
        bar.setValue(0);
        goToPrevMedia();
      } else {
        bar.setValue(1);
        goToNextMedia();
      }
    },
    [progressBars, mediaIndex, goToPrevMedia, goToNextMedia],
  );

  const startProgressAnimation = useCallback(() => {
    const bar = progressBars.current?.[mediaIndex];
    Animated.timing(bar, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNextMedia();
      }
    });
  }, [mediaIndex, progressBars, goToNextMedia]);

  useEffect(() => {
    if (isCurrentStory) {
      progressBars.current?.[mediaIndex].setValue(0);
      startProgressAnimation();
    }
  }, [mediaIndex, isCurrentStory, startProgressAnimation]);

  const currentMedia = story.medias[mediaIndex];

  return (
    <Container onPress={handlePress} delayLongPress={200}>
      <Image source={{ uri: currentMedia.url }} />
      <ProgressBarContainer>
        {story.medias.map((_, i) => (
          <ProgressBarItem
            // eslint-disable-next-line react/no-array-index-key
            key={`bar-${i}`}
          >
            <ProgressBarItemAnimated
              style={{
                width: progressBars.current?.[i].interpolate({
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
        <Input value={text} onChangeText={handleTextChange} />
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
