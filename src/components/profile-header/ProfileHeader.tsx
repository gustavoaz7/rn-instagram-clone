import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  NativeSyntheticEvent,
  Pressable,
  TextLayoutEventData,
  ViewProps,
} from 'react-native';
import { AvatarWithRing } from '../avatar-with-ring';
import { Text } from '../text';
import type { TProfile } from '../../types';
import type { THomeStackNavigationProps } from '../../navigation/HomeStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';

export type TProfileHeaderProps = TProfile & {
  style?: ViewProps['style'];
};

export const ProfileHeader = ({
  profilePicUrl,
  postsCount,
  followCount,
  followedByCount,
  story,
  fullName,
  bio,
  style,
}: TProfileHeaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<THomeStackNavigationProps>();
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioLines, setBioLines] = useState(0);

  const navigateToStory = useCallback(async () => {
    if (!story) return;
    setIsLoading(true);
    await Promise.all(story.medias.map(media => Image.prefetch(media.url)));
    setIsLoading(false);
    navigation.navigate(ROOT_STACK_SCREENS.STORY, { id: story.id, story });
  }, [navigation, story]);

  const handleBioLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setBioLines(e.nativeEvent.lines.length);
    },
    [],
  );

  const handleBioExpand = useCallback(() => {
    setBioExpanded(true);
  }, []);

  return (
    <Container testID="ProfileHeader" style={style}>
      <Row>
        <Pressable onPress={navigateToStory}>
          <AvatarWithRing
            size={90}
            imageUrl={profilePicUrl}
            color={story ? 'gradient' : 'transparent'}
            loading={isLoading}
          />
        </Pressable>
        <StatsBar>
          <StatsContainer>
            <Bold>{postsCount}</Bold>
            <Text>Posts</Text>
          </StatsContainer>
          <StatsContainer>
            <Bold>{followedByCount}</Bold>
            <Text>Followers</Text>
          </StatsContainer>
          <StatsContainer>
            <Bold>{followCount}</Bold>
            <Text>Following</Text>
          </StatsContainer>
        </StatsBar>
      </Row>
      <BoldText>{fullName}</BoldText>
      {bio ? (
        <>
          <Text
            onTextLayout={handleBioLayout}
            {...(!bioExpanded && { numberOfLines: 2 })}
            testID="profile-bio"
          >
            {bio}
          </Text>
          {bioLines > 2 && !bioExpanded ? (
            <WeakText onPress={handleBioExpand}>more</WeakText>
          ) : null}
        </>
      ) : null}
    </Container>
  );
};

const Container = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.l};
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const WeakText = styled(Text)`
  color: ${({ theme }) => theme.color.gray};
`;

const Row = styled.View`
  flex-direction: row;
`;

const StatsBar = styled(Row)`
  flex: 1;
  justify-content: space-between;
  margin-left: ${({ theme }) => theme.spacing.l};
`;

const StatsContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Bold = styled(Text)`
  font-weight: bold;
  font-size: ${({ theme }) => theme.font.size.l};
`;
