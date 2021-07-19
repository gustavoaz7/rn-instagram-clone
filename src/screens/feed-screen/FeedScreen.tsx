import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Toast from 'react-native-root-toast';
import { PostItem } from '../../components/post-item';
import { useAppDispatch } from '../../redux/hooks';
import { TPost } from '../../types';
import { storiesActions, useStoriesSelector } from '../../redux/stories';
import { StoryPreviewItem } from '../../components/story-preview-item';
import {
  isSuccess,
  isPending,
  makePending,
  makeUninitialized,
} from '../../utils/remote-data';
import { TRemotePosts, fetchPosts } from '../../services/posts';

export const POSTS_LIMIT = 20;

export function FeedScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [canFetchPosts, setCanFetchPosts] = useState(true);
  const [remotePosts, setRemotePosts] = useState<TRemotePosts>(
    makeUninitialized(),
  );
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = useCallback(
    async (refresh = false) => {
      const actualOffset = refresh ? 0 : offset;
      setRemotePosts(makePending(refresh ? null : remotePosts.data));
      const remote = await fetchPosts({
        offset: actualOffset,
        limit: POSTS_LIMIT,
        refresh,
      });

      if (isSuccess(remote)) {
        setRemotePosts(prevRemote =>
          refresh
            ? remote
            : {
                ...remote,
                data: {
                  ...remote.data,
                  posts: [
                    ...(prevRemote.data?.posts || []),
                    ...remote.data.posts,
                  ],
                },
              },
        );
        setCanFetchPosts(remote.data.canFetchMorePosts);
        setOffset(actualOffset + POSTS_LIMIT);
      } else {
        Toast.show('Failed fetching posts.', {
          position: Toast.positions.CENTER,
        });
      }
    },
    [remotePosts, offset],
  );

  const getMorePosts = useCallback(async () => {
    if (canFetchPosts && !isPending(remotePosts)) {
      getPosts();
    }
  }, [canFetchPosts, remotePosts, getPosts]);

  const {
    stories,
    loading: loadingStories,
    error: errorStories,
  } = useStoriesSelector();

  const getStories = useCallback(() => {
    dispatch(storiesActions.getStories());
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPosts(true);
    setRefreshing(false);
  }, [getPosts]);

  const LoadingPosts = useCallback(
    () =>
      isPending(remotePosts) && !loadingStories ? (
        <Loading testID="loadingPosts" />
      ) : null,
    [remotePosts, loadingStories],
  );

  useEffect(() => {
    getPosts();
    getStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // didMount

  useEffect(() => {
    if (errorStories) {
      Toast.show('Failed fetching stories.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [errorStories]);

  const renderItem = useCallback<ListRenderItem<TPost>>(
    ({ item }) => <StyledPost {...item} />,
    [],
  );
  const keyExtractor = useCallback((item: TPost) => item.id, []);

  const ListHeaderComponent = useCallback(
    () =>
      loadingStories ? (
        <Loading testID="loadingStories" />
      ) : (
        <StyledStoryPreviewList
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {stories.map(story => (
            <StyledStoryPreviewItem key={story.id} story={story} />
          ))}
        </StyledStoryPreviewList>
      ),
    [stories, loadingStories],
  );

  return (
    <Container>
      <FlatList
        data={remotePosts.data?.posts || []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={4}
        onEndReached={getMorePosts}
        onEndReachedThreshold={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.color.gray}
            colors={[theme.color.gray]}
          />
        }
        ListFooterComponent={LoadingPosts}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
  size: 'large',
  color: theme.color.gray,
}))`
  padding: ${({ theme }) => theme.spacing.s};
`;

const StyledPost = styled(PostItem)`
  margin-bottom: ${({ theme }) => theme.spacing.l};
`;

const StyledStoryPreviewList = styled.ScrollView`
  padding-bottom: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${({ theme }) => theme.color.gray}80;
`;

const StyledStoryPreviewItem = styled(StoryPreviewItem)`
  margin: 0 ${({ theme }) => theme.spacing.xs};
`;
