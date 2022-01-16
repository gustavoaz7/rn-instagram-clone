import React from 'react';
import { FlatList } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import { CommentsScreen, COMMENTS_LIMIT } from './CommentsScreen';
import { Providers } from '../../Providers';
import { generateMockPost, generateMockComment } from '../../data';
import { FakeNavigator } from '../../test/fake-navigator';
import { defaultTheme } from '../../test/default-theme';
import { fetchComments } from '../../services/comments';
import { makeFail, makeSuccess } from '../../utils/remote-data';
import { flushPromises } from '../../test/flush-promises';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: jest.fn(actual.useRoute),
  };
});
jest.mock('../../services/comments');
const fetchCommentsMock = fetchComments as jest.MockedFunction<
  typeof fetchComments
>;

describe('screens - CommentsScreen', () => {
  const post = generateMockPost();
  const options = { wrapper: Providers };
  const useRouteSpy = useRoute as jest.Mock;
  const toastSpy = jest.spyOn(Toast, 'show');

  beforeEach(() => {
    useRouteSpy.mockReturnValue({ params: { post } });
  });

  afterAll(() => {
    toastSpy.mockRestore();
  });

  it('renders', async () => {
    render(<FakeNavigator component={CommentsScreen} />, options);
  });

  describe('when post has caption', () => {
    it('renders caption as comment', () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(getAllByTestId('Comment')).toHaveLength(1);
    });
  });

  describe('when post does not have caption', () => {
    const captionlessPost = { ...post, caption: null };
    beforeEach(() => {
      useRouteSpy.mockReturnValue({ params: { post: captionlessPost } });
    });

    it('renders all comments and caption as comment', () => {
      const { queryAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(queryAllByTestId('Comment')).toHaveLength(0);
    });
  });

  it('calls fetchComments service', () => {
    render(<FakeNavigator component={CommentsScreen} />, options);

    expect(fetchCommentsMock).toHaveBeenCalledTimes(1);
    expect(fetchCommentsMock).toHaveBeenCalledWith(post.id, {
      offset: 0,
      limit: COMMENTS_LIMIT,
      refresh: false,
    });
  });

  describe('when comments are loading', () => {
    it('renders loading', () => {
      const { queryByTestId, queryAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );

      expect(queryByTestId('LoadingComments')).toBeTruthy();
      expect(queryAllByTestId('Comment')).toHaveLength(1); // caption
    });
  });

  describe('when comments succeeds', () => {
    const comments = [generateMockComment(), generateMockComment()];
    const comments2 = [generateMockComment(), generateMockComment()];

    beforeEach(() => {
      fetchCommentsMock
        .mockResolvedValueOnce(
          makeSuccess({ comments, canFetchMoreComments: true }),
        )
        .mockResolvedValueOnce(
          makeSuccess({ comments: comments2, canFetchMoreComments: true }),
        );
    });

    it('renders comments', async () => {
      const { getAllByTestId } = render(
        <FakeNavigator component={CommentsScreen} />,
        options,
      );
      await act(async () => {
        await flushPromises();
      });

      expect(getAllByTestId('Comment')).toHaveLength(comments.length + 1);
    });

    describe('when reaches the end of list', () => {
      it('calls fetchComments service a second time', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        await act(async () => {
          UNSAFE_getByType(FlatList).props.onEndReached();
          await flushPromises();
        });

        expect(fetchCommentsMock).toHaveBeenCalledTimes(2);
        expect(fetchCommentsMock).toHaveBeenNthCalledWith(2, post.id, {
          offset: COMMENTS_LIMIT,
          limit: COMMENTS_LIMIT,
          refresh: false,
        });
      });

      it('does not calls fetchComments when alerady loading', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(fetchCommentsMock).toHaveBeenCalledTimes(2);

        await act(async () => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(fetchCommentsMock).toHaveBeenCalledTimes(2);
      });

      it('rendes previous comments and loading spinner', async () => {
        const { UNSAFE_getByType, queryByTestId, queryAllByTestId } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        act(() => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        expect(queryAllByTestId('Comment')).toHaveLength(comments.length + 1); // caption
        expect(queryByTestId('LoadingComments')).toBeTruthy();
        await act(async () => {
          await flushPromises();
        });
      });

      it('rendes old and new comments', async () => {
        const { UNSAFE_getByType, queryByText } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        await act(async () => {
          UNSAFE_getByType(FlatList).props.onEndReached();
        });

        const allComments = [...comments, ...comments2];
        allComments.forEach(comment => {
          queryByText(comment.text);
        });
      });

      describe('and there are no more comments to fetch', () => {
        beforeEach(() => {
          fetchCommentsMock
            .mockReset()
            .mockResolvedValueOnce(
              makeSuccess({ comments, canFetchMoreComments: false }),
            );
        });

        it('does not request for more comments', async () => {
          const { UNSAFE_getByType } = render(
            <FakeNavigator component={CommentsScreen} />,
            options,
          );
          await act(async () => {
            await flushPromises();
          });

          await act(async () => {
            UNSAFE_getByType(FlatList).props.onEndReached();
          });

          expect(fetchCommentsMock).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('on pull to refresh', () => {
      it('calls fetchComments service with "refresh" param', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        const { refreshControl } = UNSAFE_getByType(FlatList).props;

        await act(async () => {
          await refreshControl.props.onRefresh();
        });

        expect(fetchCommentsMock).toHaveBeenCalledTimes(2);
        expect(fetchCommentsMock).toHaveBeenNthCalledWith(2, post.id, {
          offset: 0,
          limit: COMMENTS_LIMIT,
          refresh: true,
        });
      });

      it('removes previous comments and renders only loading', async () => {
        const { UNSAFE_getByType, queryAllByTestId, queryByTestId } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        act(() => {
          UNSAFE_getByType(FlatList).props.refreshControl.props.onRefresh();
        });

        expect(queryAllByTestId('Comment')).toHaveLength(1); // caption
        expect(queryByTestId('LoadingComments')).toBeTruthy();
        await act(async () => {
          await flushPromises();
        });
      });

      it('has gray color', async () => {
        const { UNSAFE_getByType } = render(
          <FakeNavigator component={CommentsScreen} />,
          options,
        );
        await act(async () => {
          await flushPromises();
        });

        const { refreshControl } = UNSAFE_getByType(FlatList).props;

        expect(refreshControl.props.tintColor).toBe(defaultTheme.color.gray);
        expect(refreshControl.props.colors).toEqual([defaultTheme.color.gray]);
      });
    });
  });

  describe('when posts fails', () => {
    beforeEach(() => {
      fetchCommentsMock
        .mockReset()
        .mockResolvedValueOnce(makeFail(new Error('')));
    });

    it('shows toast', async () => {
      render(<FakeNavigator component={CommentsScreen} />, options);
      await act(async () => {
        await flushPromises();
      });

      expect(toastSpy).toHaveBeenCalledTimes(1);
      expect(toastSpy).toHaveBeenCalledWith('Failed fetching comments.', {
        position: Toast.positions.CENTER,
      });
    });
  });
});
