import React from 'react';
import { act, render } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import { FlatList } from 'react-native';
import { FeedScreen, POSTS_LIMIT } from './FeedScreen';
import { Providers } from '../../Providers';
import * as reduxStories from '../../redux/stories';
import * as reduxHooks from '../../redux/hooks';
import { generateMockPost, generateMockStory } from '../../data';
import { FakeNavigator } from '../../test/fake-navigator';
import { theme } from '../../styles/theme';
import { fetchPosts } from '../../services/posts';
import { makeFail, makeSuccess } from '../../utils/remote-data';
import { flushPromises } from '../../test/flush-promises';

jest.mock('../../services/posts');
const fetchPostsMock = fetchPosts as jest.MockedFunction<typeof fetchPosts>;

describe('screens - FeedScreen', () => {
  const options = { wrapper: Providers };
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const useStoriesSelectorSpy = jest
    .spyOn(reduxStories, 'useStoriesSelector')
    .mockReturnValue(reduxStories.initialState);
  const getStoriesSpy = jest.spyOn(reduxStories.storiesActions, 'getStories');
  const toastSpy = jest.spyOn(Toast, 'show');

  afterAll(() => {
    useDispatchSpy.mockRestore();
    useStoriesSelectorSpy.mockRestore();
    getStoriesSpy.mockRestore();
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FakeNavigator component={FeedScreen} />, options);
  });

  it('dispatches stories action', () => {
    const storiesAction = Math.random();
    getStoriesSpy.mockReturnValueOnce(storiesAction as any);
    render(<FakeNavigator component={FeedScreen} />, options);

    expect(getStoriesSpy).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, storiesAction);
  });

  it('calls fetchPosts service', () => {
    render(<FakeNavigator component={FeedScreen} />, options);

    expect(fetchPostsMock).toHaveBeenCalledTimes(1);
    expect(fetchPostsMock).toHaveBeenCalledWith({
      offset: 0,
      limit: POSTS_LIMIT,
      refresh: false,
    });
  });

  it('renders loading', () => {
    const { queryByTestId } = render(
      <FakeNavigator component={FeedScreen} />,
      options,
    );

    expect(queryByTestId('PostItem')).toBeFalsy();
    expect(queryByTestId('loadingPosts')).toBeTruthy();
  });

  describe('when posts succeeds', () => {
    const posts = [generateMockPost(), generateMockPost()];
    const posts2 = [generateMockPost(), generateMockPost()];

    beforeEach(() => {
      fetchPostsMock
        .mockResolvedValueOnce(makeSuccess({ posts, canFetchMorePosts: true }))
        .mockResolvedValueOnce(
          makeSuccess({ posts: posts2, canFetchMorePosts: true }),
        );
    });

    it('renders post items', async () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={FeedScreen} />,
        options,
      );
      await act(async () => {
        await flushPromises();
      });

      expect(getAllByTestId('PostItem')).toHaveLength(posts.length);
    });

    describe('when reaches the end of list', () => {
      it('calls fetchComments service a second time', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        await act(async () => {
          UNSAFE_getByType(FlatList).props.onEndReached();
          await flushPromises();
        });

        expect(fetchPosts).toHaveBeenCalledTimes(2);
        expect(fetchPosts).toHaveBeenLastCalledWith({
          offset: POSTS_LIMIT,
          limit: POSTS_LIMIT,
          refresh: false,
        });
      });

      it('does not call fetchPosts when alerady loading', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(fetchPostsMock).toHaveBeenCalledTimes(2);

        await act(async () => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(fetchPostsMock).toHaveBeenCalledTimes(2);
      });

      it('rendes previous posts and loading spinner', async () => {
        const { queryByTestId, queryAllByTestId, UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(queryAllByTestId('PostItem')).toHaveLength(posts.length);
        expect(queryByTestId('loadingPosts')).toBeTruthy();
        await act(async () => {
          await flushPromises();
        });
      });

      it('rendes old and new posts', async () => {
        const { UNSAFE_getByType, queryAllByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        await act(async () => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(queryAllByTestId('PostItem')).toHaveLength(
          posts.length + posts2.length,
        );
      });

      describe('and there is no more posts to fetch', () => {
        beforeEach(() => {
          fetchPostsMock
            .mockReset()
            .mockResolvedValueOnce(
              makeSuccess({ posts, canFetchMorePosts: false }),
            );
        });

        it('does not request for more posts', async () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={FeedScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          await act(async () => {
            UNSAFE_getByType(FlatList).props.onEndReached();
          });

          expect(fetchPostsMock).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('on pull to refresh', () => {
      it('calls fetchPosts service with "refresh" param', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        const { refreshControl } = UNSAFE_getByType(FlatList).props;

        await act(async () => {
          await refreshControl.props.onRefresh();
        });

        expect(fetchPostsMock).toHaveBeenCalledTimes(2);
        expect(fetchPostsMock).toHaveBeenLastCalledWith({
          offset: 0,
          limit: POSTS_LIMIT,
          refresh: true,
        });
      });

      it('removes previous comments and renders only loading', async () => {
        const { UNSAFE_getByType, queryByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        act(() => {
          UNSAFE_getByType(FlatList).props.refreshControl.props.onRefresh();
        });

        expect(queryByTestId('PostItem')).toBeFalsy();
        expect(queryByTestId('loadingPosts')).toBeTruthy();
        await act(async () => {
          await flushPromises();
        });
      });

      it('has gray color', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });
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

      it('renders loading spinner', async () => {
        const { queryByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

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

      it('renders story preview items', async () => {
        const { getAllByTestId } = render(
          <FakeNavigator component={FeedScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        expect(getAllByTestId('StoryPreviewItem')).toHaveLength(stories.length);
      });
    });
  });

  describe('when posts fails', () => {
    beforeEach(() => {
      fetchPostsMock.mockReset().mockResolvedValueOnce(makeFail(new Error('')));
    });

    it('shows toast', async () => {
      render(<FakeNavigator component={FeedScreen} />, options);
      await act(async () => {
        await flushPromises();
      });

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith('Failed fetching posts.', {
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
