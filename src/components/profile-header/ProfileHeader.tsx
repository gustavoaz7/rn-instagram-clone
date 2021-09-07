import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, ViewProps } from 'react-native';
import { AvatarWithRing } from '../avatar-with-ring';
import { Text } from '../text';
import type { TProfile } from '../../types';
import type { THomeStackNavigationProps } from '../../navigation/HomeStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';

export type TProfileHeaderProps = Pick<
  TProfile,
  'profilePicUrl' | 'postsCount' | 'followCount' | 'followedByCount' | 'story'
> & {
  style?: ViewProps['style'];
};

export const ProfileHeader = ({
  profilePicUrl,
  postsCount,
  followCount,
  followedByCount,
  story,
  style,
}: TProfileHeaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<THomeStackNavigationProps>();

  const handlePress = useCallback(async () => {
    if (!story) return;
    setIsLoading(true);
    await Promise.all(story.medias.map(media => Image.prefetch(media.url)));
    setIsLoading(false);
    navigation.navigate(ROOT_STACK_SCREENS.STORY, { id: story.id, story });
  }, [navigation, story]);

  return (
    <Row style={style} testID="ProfileHeader">
      <Pressable onPress={handlePress}>
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
  );
};

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
