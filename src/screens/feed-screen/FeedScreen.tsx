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
import { postsActions, usePostsSelector } from '../../redux/posts';
import { TPost } from '../../types';
import { storiesActions, useStoriesSelector } from '../../redux/stories';
import { StoryPreviewItem } from '../../components/story-preview-item';

export const POSTS_LIMIT = 20;

export function FeedScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const {
    posts,
    loading: loadingPosts,
    error: errorPosts,
    canFetchMorePosts,
  } = usePostsSelector();

  const getPosts = useCallback(() => {
    if (canFetchMorePosts && !loadingPosts) {
      dispatch(postsActions.getPosts({ offset, limit: POSTS_LIMIT }));
      setOffset(offset + POSTS_LIMIT);
    }
  }, [canFetchMorePosts, loadingPosts, dispatch, offset]);

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
    setOffset(0);
    await dispatch(
      postsActions.getPosts({ offset: 0, limit: POSTS_LIMIT, refresh: true }),
    );
    setRefreshing(false);
  }, [dispatch]);

  const LoadingMorePosts = useCallback(
    () => (loadingPosts ? <Loading testID="loadingMorePosts" /> : null),
    [loadingPosts],
  );

  useEffect(() => {
    getPosts();
    getStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // didMount

  useEffect(() => {
    if (errorPosts) {
      Toast.show('Failed fetching posts.', {
        position: Toast.positions.CENTER,
      });
    }
    if (errorStories) {
      Toast.show('Failed fetching stories.', {
        position: Toast.positions.CENTER,
      });
    }
  }, [errorPosts, errorStories]);

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
      {loadingPosts && !posts.length ? <Loading testID="loadingPosts" /> : null}
      {posts.length ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={4}
          onEndReached={getPosts}
          onEndReachedThreshold={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.color.gray}
              colors={[theme.color.gray]}
            />
          }
          ListFooterComponent={LoadingMorePosts}
          ListHeaderComponent={ListHeaderComponent}
        />
      ) : null}
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
}))``;

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
