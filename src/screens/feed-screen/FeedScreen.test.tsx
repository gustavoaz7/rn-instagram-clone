import React from 'react';
import { act, render } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import { FlatList } from 'react-native';
import { FeedScreen, POSTS_LIMIT } from './FeedScreen';
import { Providers } from '../../Providers';
import * as reduxPosts from '../../redux/posts';
import * as reduxStories from '../../redux/stories';
import * as reduxHooks from '../../redux/hooks';
import { generateMockPost, generateMockStory } from '../../data';
import { FakeNavigator } from '../../test/fake-navigator';
import { theme } from '../../styles/theme';

describe('screens - FeedScreen', () => {
  const options = { wrapper: Providers };
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const usePostsSelectorSpy = jest
    .spyOn(reduxPosts, 'usePostsSelector')
    .mockReturnValue(reduxPosts.initialState);
  const getPostsSpy = jest.spyOn(reduxPosts.postsActions, 'getPosts');
  const useStoriesSelectorSpy = jest
    .spyOn(reduxStories, 'useStoriesSelector')
    .mockReturnValue(reduxStories.initialState);
  const getStoriesSpy = jest.spyOn(reduxStories.storiesActions, 'getStories');
  const toastSpy = jest.spyOn(Toast, 'show');

  afterAll(() => {
    useDispatchSpy.mockRestore();
    usePostsSelectorSpy.mockRestore();
    useStoriesSelectorSpy.mockRestore();
    getPostsSpy.mockRestore();
    getStoriesSpy.mockRestore();
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FakeNavigator component={FeedScreen} />, options);
  });

  it('dispatches get posts and stories actions', () => {
    const postsAction = Math.random();
    const storiesAction = Math.random();
    getPostsSpy.mockReturnValueOnce(postsAction as any);
    getStoriesSpy.mockReturnValueOnce(storiesAction as any);
    render(<FakeNavigator component={FeedScreen} />, options);

    expect(getPostsSpy).toHaveBeenCalledTimes(1);
    expect(getPostsSpy).toHaveBeenCalledWith({ offset: 0, limit: POSTS_LIMIT });
    expect(getStoriesSpy).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, postsAction);
    expect(dispatchMock).toHaveBeenNthCalledWith(2, storiesAction);
  });

  describe('when posts are loading', () => {
    beforeEach(() => {
      usePostsSelectorSpy.mockReturnValue({
        ...reduxPosts.initialState,
        loading: true,
      });
    });

    it('renders loading', () => {
      const { queryByTestId } = render(
        <FakeNavigator component={FeedScreen} />,
        options,
      );

      expect(queryByTestId('loadingPosts')).toBeTruthy();
      expect(queryByTestId('loadingMorePosts')).toBeFalsy();
    });
  });

  describe('when posts succeeds', () => {
    const posts = [generateMockPost(), generateMockPost()];

    beforeEach(() => {
      usePostsSelectorSpy.mockReturnValue({
        ...reduxPosts.initialState,
        posts,
      });
    });

    it('renders post items', () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={FeedScreen} />,
        options,
      );

      expect(getAllByTestId('PostItem')).toHaveLength(posts.length);
    });

    describe('when reaches the end of list', () => {
      beforeEach(() => {
        usePostsSelectorSpy.mockReturnValue({
          ...reduxPosts.initialState,
          loading: true,
          posts,
        });
      });

      it('dispatches a second get posts action', () => {
        usePostsSelectorSpy.mockReturnValue({
          ...reduxPosts.initialState,
          posts,
        });
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        expect(getPostsSpy).toHaveBeenCalledTimes(1);
        getPostsSpy.mockReset();

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(getPostsSpy).toHaveBeenCalledTimes(1);
        expect(getPostsSpy).toHaveBeenCalledWith({
          offset: POSTS_LIMIT,
          limit: POSTS_LIMIT,
        });
      });

      it('does not dispatches get posts when alerady loading', () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(getPostsSpy).not.toHaveBeenCalled();
      });

      it('rendes loading as footer of list', async () => {
        const { queryByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        expect(queryByTestId('loadingPosts')).toBeFalsy();
        expect(queryByTestId('loadingMorePosts')).toBeTruthy();
      });

      describe('and there is no more posts to fetch', () => {
        beforeEach(() => {
          usePostsSelectorSpy.mockReturnValue({
            ...reduxPosts.initialState,
            posts,
            canFetchMorePosts: false,
          });
        });

        it('does not dispatches another get posts action', () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={FeedScreen} />,
            options,
          );

          act(() => {
            UNSAFE_getByType(FlatList).props.onEndReached();
          });

          expect(getPostsSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('on pull to refresh', () => {
      it('dispatches get posts action with "refresh" param', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        const { refreshControl } = UNSAFE_getByType(FlatList).props;

        await act(async () => {
          await refreshControl.props.onRefresh();
        });

        expect(getPostsSpy).toHaveBeenLastCalledWith({
          offset: 0,
          limit: POSTS_LIMIT,
          refresh: true,
        });
      });

      it('has gray color', () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        const { refreshControl } = UNSAFE_getByType(FlatList).props;

        expect(refreshControl.props.tintColor).toBe(theme.color.gray);
        expect(refreshControl.props.colors).toEqual([theme.color.gray]);
      });
    });

    describe('when stories are still loading', () => {
      beforeEach(() => {
        useStoriesSelectorSpy.mockReturnValue({
          ...reduxStories.initialState,
          loading: true,
        });
      });

      it('renders loading for stories', () => {
        const { queryByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        expect(queryByTestId('loadingStories')).toBeTruthy();
      });
    });

    describe('when stories succeeds', () => {
      const stories = [generateMockStory(), generateMockStory()];

      beforeEach(() => {
        useStoriesSelectorSpy.mockReturnValue({
          ...reduxStories.initialState,
          stories,
        });
      });

      it('renders story preview items', () => {
        const { getAllByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );

        expect(getAllByTestId('StoryPreviewItem')).toHaveLength(stories.length);
      });
    });
  });

  describe('when posts fails', () => {
    beforeEach(() => {
      usePostsSelectorSpy.mockReturnValueOnce({
        ...reduxPosts.initialState,
        error: 'fail',
      });
    });

    it('shows toast', () => {
      render(<FakeNavigator component={FeedScreen} />, options);

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining(''), {
        position: Toast.positions.CENTER,
      });
    });
  });

  describe('when stories fails', () => {
    beforeEach(() => {
      useStoriesSelectorSpy.mockReturnValueOnce({
        ...reduxStories.initialState,
        error: 'fail',
      });
    });

    it('shows toast', () => {
      render(<FakeNavigator component={FeedScreen} />, options);

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining(''), {
        position: Toast.positions.CENTER,
      });
    });
  });
});
