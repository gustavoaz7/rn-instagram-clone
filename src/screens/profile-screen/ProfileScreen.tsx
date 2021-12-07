import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import Toast from 'react-native-root-toast';
import styled, { useTheme } from 'styled-components/native';
import { GalleryGrid } from '../../components/gallery-grid';
import { ProfileHeader } from '../../components/profile-header/ProfileHeader';
import type { TProfileStackParams } from '../../navigation/ProfileStackNavigator';
import { PROFILE_STACK_SCREENS } from '../../navigation/screens';
import { fetchUserPosts, TRemoteUserPosts } from '../../services/posts';
import { fetchProfile, TRemoteProfile } from '../../services/user';
import {
  isFail,
  isPending,
  isSuccess,
  makePending,
  makeUninitialized,
} from '../../utils/remote-data';

export type ProfileScreenRouteProp = RouteProp<
  TProfileStackParams,
  PROFILE_STACK_SCREENS.PROFILE
>;
export const POSTS_LIMIT = 30;

export function ProfileScreen(): JSX.Element {
  const theme = useTheme();
  const route = useRoute<ProfileScreenRouteProp>();
  const { username } = route.params;
  const [remoteProfile, setRemoteProfile] = useState<TRemoteProfile>(
    makeUninitialized(),
  );
  const [canFetchPosts, setCanFetchPosts] = useState(true);
  const [remotePosts, setRemotePosts] = useState<TRemoteUserPosts>(
    makeUninitialized(),
  );
  const [offset, setOffset] = useState(0);

  const getUserPosts = useCallback(async () => {
    setRemotePosts(makePending(remotePosts.data));
    const remote = await fetchUserPosts(username, {
      offset,
      limit: POSTS_LIMIT,
    });

    if (isSuccess(remote)) {
      setRemotePosts(prevRemote => ({
        ...remote,
        data: {
          ...remote.data,
          posts: [...(prevRemote.data?.posts || []), ...remote.data.posts],
        },
      }));
      setCanFetchPosts(remote.data.canFetchMorePosts);
      setOffset(offset + POSTS_LIMIT);
    } else {
      Toast.show('Failed fetching posts.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [username, remotePosts, offset]);

  const getMorePosts = useCallback(async () => {
    if (canFetchPosts && !isPending(remotePosts)) {
      getUserPosts();
    }
  }, [canFetchPosts, remotePosts, getUserPosts]);

  const getProfile = useCallback(async () => {
    setRemoteProfile(makePending());
    const profile = await fetchProfile(username);
    setRemoteProfile(profile);
    if (isFail(profile)) {
      Toast.show('Failed fetching profile.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [username]);

  const loadFullScreenData = useCallback(() => {
    // Promise.all([getProfile(), getUserPosts()]);
    getProfile();
    getUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(loadFullScreenData, [loadFullScreenData]);

  if (isPending(remoteProfile)) return <Loading testID="Loading-Profile" />;

  return (
    <Container>
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={loadFullScreenData}
            tintColor={theme.color.gray}
            colors={[theme.color.gray]}
          />
        }
        ListHeaderComponent={() =>
          isSuccess(remoteProfile) ? (
            <>
              <StyledHeader {...remoteProfile.data} />
              {remotePosts.data?.posts ? (
                <GalleryGrid
                  posts={remotePosts.data.posts}
                  onEndReached={getMorePosts}
                />
              ) : null}
              {isPending(remotePosts) ? (
                <Loading testID="Loading-Posts" />
              ) : null}
            </>
          ) : null
        }
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const StyledHeader = styled(ProfileHeader)`
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
  size: 'large',
  color: theme.color.gray,
}))`
  padding: ${({ theme }) => theme.spacing.s};
`;
