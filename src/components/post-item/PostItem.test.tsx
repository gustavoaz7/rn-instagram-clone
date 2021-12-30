/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
  act,
} from '@testing-library/react-native';
import faker from 'faker';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import { PostItem } from './PostItem';
import { Providers } from '../../Providers';
import {
  generateMockPost,
  generateMockPostMedia,
  generateMockLike,
  generateMockComment,
  generateMockTappableObject,
} from '../../data';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { theme } from '../../styles/theme';
import {
  timeTravel,
  setupTimeTravel,
  destroyTimeTravel,
} from '../../test/time-travel';
import { postLike } from '../../services/likes';
import { makeFail, makeSuccess } from '../../utils/remote-data';
import { flushPromises } from '../../test/flush-promises';
import { TPost } from '../../types';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;
jest.mock('../../services/likes');
const postLikeMock = postLike as jest.MockedFunction<typeof postLike>;

describe('components - PostItem', () => {
  const toastSpy = jest.spyOn(Toast, 'show');
  const post = generateMockPost();
  const multiCommentPost = {
    ...post,
    previewComments: {
      count: 2,
      comments: [...Array(2)].map(generateMockComment),
    },
  };
  const options: RenderOptions = { wrapper: Providers };

  afterAll(() => {
    toastSpy.mockRestore();
  });

  it('renders', () => {
    render(<PostItem {...post} />, options);
  });

  it('matches snapshot', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowMock = jest.fn(() => multiCommentPost.createdAt + 3600 * 1000);
    global.Date.now = dateNowMock;

    const { toJSON } = render(<PostItem {...multiCommentPost} />, options);

    expect(toJSON()).toMatchSnapshot();
    global.Date.now = realDateNow;
  });

  it('inherits style', () => {
    const style = { backgroundColor: 'orange' };
    const { getByTestId } = render(
      <PostItem {...post} style={style} />,
      options,
    );

    expect(getByTestId('PostItem')).toHaveStyle(style);
  });

  it('renders without location', () => {
    const { location, ...rest } = post;
    render(<PostItem {...rest} />, options);
  });

  describe('likes', () => {
    it('renders without likes', () => {
      const previewLikes = { count: 0, likes: [] };
      render(<PostItem {...post} previewLikes={previewLikes} />, options);
    });

    it('renders singular when 1 like', () => {
      const previewLikes = { count: 1, likes: [generateMockLike()] };
      const { getByText } = render(
        <PostItem {...post} previewLikes={previewLikes} />,
        options,
      );

      expect(getByText('1 like')).toBeTruthy();
    });

    it('renders plural when > 2 likes', () => {
      const previewLikes = {
        count: 2,
        likes: [...Array(2).map(generateMockLike)],
      };
      const { getByText } = render(
        <PostItem {...post} previewLikes={previewLikes} />,
        options,
      );

      expect(getByText('2 likes')).toBeTruthy();
    });

    describe('when user has liked the post', () => {
      it('renders red heart', () => {
        const { getByTestId } = render(
          <PostItem {...post} viewerHasLiked />,
          options,
        );

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      describe('when user press heart icon', () => {
        it('calls postLike with flag as `false`', async () => {
          const { getByTestId } = render(
            <PostItem {...post} viewerHasLiked />,
            options,
          );

          act(() => {
            fireEvent.press(getByTestId('PostItem-Heart'));
          });

          expect(postLikeMock).toHaveBeenCalledTimes(1);
          expect(postLikeMock).toHaveBeenCalledWith({
            id: post.id,
            flag: false,
            collection: 'posts',
          });
        });
      });
    });

    describe('when user press heart icon', () => {
      it('calls postLike with flag as `true`', async () => {
        const { getByTestId } = render(<PostItem {...post} />, options);

        act(() => {
          fireEvent.press(getByTestId('PostItem-Heart'));
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(postLikeMock).toHaveBeenCalledWith({
          id: post.id,
          flag: true,
          collection: 'posts',
        });
      });

      it('increases like count by 1', async () => {
        const previewLikes = {
          count: 2,
          likes: [...Array(2).map(generateMockLike)],
        };
        const { getByTestId, getByText } = render(
          <PostItem {...post} previewLikes={previewLikes} />,
          options,
        );

        act(() => {
          fireEvent.press(getByTestId('PostItem-Heart'));
        });

        expect(getByText('3 likes')).toBeTruthy();
      });

      it('changes heart from outline black to filled red', () => {
        const { getByTestId } = render(<PostItem {...post} />, options);

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.black);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          fireEvent.press(heartIcon);
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      it('disables press until request is completed', async () => {
        postLikeMock.mockResolvedValue(makeSuccess(undefined));
        const { getByTestId } = render(<PostItem {...post} />, options);

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.black);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          fireEvent.press(heartIcon);
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);

        await act(async () => {
          fireEvent.press(heartIcon);
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);

        await act(async () => {
          fireEvent.press(heartIcon);
        });

        expect(postLikeMock).toHaveBeenCalledTimes(2);
        expect(heartIcon.props.color).toBe(theme.color.black);
        expect(heartIcon.props.fill).toBe('none');
      });
    });

    describe('when user double-taps post media', () => {
      it('calls postLike', async () => {
        const { UNSAFE_getByType } = render(<PostItem {...post} />, options);

        await act(async () => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(postLikeMock).toHaveBeenCalledWith({
          id: post.id,
          flag: true,
          collection: 'posts',
        });
      });

      it('increases like count by 1', async () => {
        const previewLikes = {
          count: 2,
          likes: [...Array(2).map(generateMockLike)],
        };
        const { UNSAFE_getByType, getByText } = render(
          <PostItem {...post} previewLikes={previewLikes} />,
          options,
        );

        await act(async () => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(getByText('3 likes')).toBeTruthy();
      });

      it('disables double-tap until request is completed', async () => {
        postLikeMock.mockResolvedValue(makeSuccess(undefined));
        setupTimeTravel();
        const { queryByTestId, UNSAFE_getByType } = render(
          <PostItem {...post} />,
          options,
        );

        act(() => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(queryByTestId('PostItem-HeartOverlay')).not.toBe(null);

        act(() => {
          timeTravel(2000);
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(queryByTestId('PostItem-HeartOverlay')).toBe(null);

        await act(async () => {
          await flushPromises();
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(queryByTestId('PostItem-HeartOverlay')).not.toBe(null);

        destroyTimeTravel();
      });

      describe('when double-taps once more', () => {
        it('does not call postLike again', async () => {
          const { UNSAFE_getByType } = render(<PostItem {...post} />, options);

          await act(async () => {
            UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
              nativeEvent: { state: State.ACTIVE },
            });
          });

          expect(postLikeMock).toHaveBeenCalledTimes(1);

          await act(async () => {
            UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
              nativeEvent: { state: State.ACTIVE },
            });
          });

          expect(postLikeMock).toHaveBeenCalledTimes(1);
        });
      });

      it('does not increase like count', async () => {
        const previewLikes = {
          count: 2,
          likes: [...Array(2).map(generateMockLike)],
        };
        const { UNSAFE_getByType, getByText } = render(
          <PostItem {...post} previewLikes={previewLikes} />,
          options,
        );

        await act(async () => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(getByText('3 likes')).toBeTruthy();

        await act(async () => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(getByText('3 likes')).toBeTruthy();
      });

      it('changes heart from outline black to filled red', async () => {
        const { getByTestId, UNSAFE_getByType } = render(
          <PostItem {...post} />,
          options,
        );

        const heartIcon = getByTestId('PostItem-Heart');

        expect(heartIcon.props.color).toBe(theme.color.black);
        expect(heartIcon.props.fill).toBe('none');

        await act(async () => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      it('renders heart overlay and then hides it', async () => {
        setupTimeTravel();
        const { queryByTestId, UNSAFE_getByType } = render(
          <PostItem {...post} />,
          options,
        );

        expect(queryByTestId('PostItem-HeartOverlay')).toBe(null);

        await act(async () => {
          UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(queryByTestId('PostItem-HeartOverlay')).not.toBe(null);

        await act(async () => {
          timeTravel(2000);
        });

        expect(queryByTestId('PostItem-HeartOverlay')).toBe(null);
        destroyTimeTravel();
      });
    });
  });

  describe('caption', () => {
    it('renders without caption', () => {
      const { caption, ...rest } = post;
      render(<PostItem {...rest} />, options);
    });

    it('renders all caption when short', () => {
      const caption = faker.lorem.words(2);

      const { getByText } = render(
        <PostItem {...post} caption={caption} />,
        options,
      );

      expect(getByText(RegExp(`${caption}$`))).toBeTruthy();
    });

    describe('when caption is long', () => {
      it('renders clipped caption and expands on "more" click', async () => {
        const caption = faker.lorem.paragraph();

        const { getByText, queryByText, getByTestId } = render(
          <PostItem {...post} caption={caption} />,
          options,
        );

        act(() =>
          getByTestId('post-caption').props.onTextLayout({
            nativeEvent: { lines: { length: 5 } },
          }),
        );

        expect(queryByText(caption)).toBeFalsy();

        const moreText = getByText('more');
        expect(moreText).toBeTruthy();

        fireEvent.press(moreText);

        expect(getByText(RegExp(`${caption}$`))).toBeTruthy();
      });
    });
  });

  describe('comments', () => {
    it('renders without comments', () => {
      const previewComments = { count: 0, comments: [] };
      render(<PostItem {...post} previewComments={previewComments} />, options);
    });

    describe('when there is a single comment', () => {
      it('renders first comment without "see all"', () => {
        const { queryByText } = render(<PostItem {...post} />, options);

        expect(
          queryByText(`${post.previewComments.comments[0].owner.username} `),
        ).toBeTruthy();
        expect(
          queryByText(new RegExp(`${post.previewComments.comments[0].text}$`)),
        ).toBeTruthy();
        expect(queryByText(new RegExp(`^See all`))).toBeFalsy();
      });
    });

    describe('when there are multiple comments', () => {
      it('renders first comment and "see all" text', () => {
        const { queryByText } = render(
          <PostItem {...multiCommentPost} />,
          options,
        );

        expect(
          queryByText(
            `${multiCommentPost.previewComments.comments[0].owner.username} `,
          ),
        ).toBeTruthy();
        expect(
          queryByText(
            new RegExp(`${multiCommentPost.previewComments.comments[0].text}$`),
          ),
        ).toBeTruthy();
        expect(
          queryByText(
            `See all ${multiCommentPost.previewComments.count} comments`,
          ),
        ).toBeTruthy();
      });

      it('navigates to comments screen on "see all" press', () => {
        const navigateSpy = jest.fn();
        useNavigationMock.mockReturnValueOnce({ navigate: navigateSpy });
        const { getByText } = render(
          <PostItem {...multiCommentPost} />,
          options,
        );

        fireEvent.press(
          getByText(
            `See all ${multiCommentPost.previewComments.count} comments`,
          ),
        );

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(ROOT_STACK_SCREENS.COMMENTS, {
          post: multiCommentPost,
        });
      });
    });

    describe('when user has liked the first comment', () => {
      const postWithLikedComment = {
        ...post,
        previewComments: {
          ...post.previewComments,
          comments: [
            { ...post.previewComments.comments[0], viewerHasLiked: true },
          ],
        },
      };

      it('renders filled comment heart', () => {
        const { getByTestId } = render(
          <PostItem {...postWithLikedComment} />,
          options,
        );

        const heartIcon = getByTestId('PostItem-CommentHeart');

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      describe('when user press heart icon', () => {
        it('calls postLike service with flag as `false`', async () => {
          const { getByTestId } = render(
            <PostItem {...postWithLikedComment} />,
            options,
          );

          await act(async () => {
            fireEvent.press(getByTestId('PostItem-CommentHeart'));
          });

          expect(postLikeMock).toHaveBeenCalledTimes(1);
          expect(postLikeMock).toHaveBeenCalledWith({
            id: post.previewComments.comments[0].id,
            flag: false,
            collection: 'comments',
          });
        });
      });
    });

    describe('when user likes the first comment', () => {
      it('calls postLike service with flag as `true`', async () => {
        const { getByTestId } = render(<PostItem {...post} />, options);

        await act(async () => {
          fireEvent.press(getByTestId('PostItem-CommentHeart'));
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(postLikeMock).toHaveBeenCalledWith({
          id: post.previewComments.comments[0].id,
          flag: true,
          collection: 'comments',
        });
      });

      it('changes heart from outline gray to filled red', async () => {
        const { getByTestId } = render(<PostItem {...post} />, options);

        const heartIcon = getByTestId('PostItem-CommentHeart');

        expect(heartIcon.props.color).toBe(theme.color.gray);
        expect(heartIcon.props.fill).toBe('none');

        await act(async () => {
          fireEvent.press(heartIcon);
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      it('disables press until request is completed', async () => {
        postLikeMock.mockResolvedValue(makeSuccess(undefined));
        const { getByTestId } = render(<PostItem {...post} />, options);

        const heartIcon = getByTestId('PostItem-CommentHeart');

        expect(heartIcon.props.color).toBe(theme.color.gray);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          fireEvent.press(heartIcon);
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);

        await act(async () => {
          fireEvent.press(heartIcon);
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);

        await act(async () => {
          fireEvent.press(heartIcon);
        });

        expect(postLikeMock).toHaveBeenCalledTimes(2);
        expect(heartIcon.props.color).toBe(theme.color.gray);
        expect(heartIcon.props.fill).toBe('none');
      });

      describe('when request fails', () => {
        beforeEach(() => {
          postLikeMock.mockResolvedValueOnce(makeFail(new Error('')));
        });

        it('shows toast', async () => {
          const { getByTestId } = render(<PostItem {...post} />, options);

          await act(async () => {
            fireEvent.press(getByTestId('PostItem-CommentHeart'));
            await flushPromises();
          });

          expect(toastSpy).toHaveBeenCalledTimes(1);
          expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining(''), {
            position: Toast.positions.CENTER,
          });
        });
      });
    });
  });

  describe('when post has multiple images', () => {
    const multiImagePost = {
      ...post,
      medias: [...Array(4)].map(generateMockPostMedia),
    };

    it('renders images slider', () => {
      const { getByTestId } = render(<PostItem {...multiImagePost} />, options);

      const slider = getByTestId('PostItem-Slider');

      expect(slider.props).toMatchObject({
        horizontal: true,
        pagingEnabled: true,
      });
      slider.findAllByType(Image).forEach((image, i) => {
        expect(image.props.source.uri).toBe(multiImagePost.medias[i].url);
      });
    });

    it('renders pagination', () => {
      const { getAllByTestId } = render(
        <PostItem {...multiImagePost} />,
        options,
      );

      expect(getAllByTestId('Pagination-Dot')).toHaveLength(
        multiImagePost.medias.length,
      );
    });

    it('renders slider page indicator', () => {
      const { getByText } = render(<PostItem {...multiImagePost} />, options);

      expect(getByText(`1/${multiImagePost.medias.length}`));
    });
  });

  describe.only('mentions - when user single-tap post image', () => {
    describe('when post has no mentions', () => {
      it('does nothing', async () => {
        const mentionlessPost: TPost = {
          ...post,
          medias: [
            {
              ...post.medias[0],
              tappableObjects: [],
            },
          ],
        };
        const { UNSAFE_getAllByType, queryByTestId } = render(
          <PostItem {...mentionlessPost} />,
          options,
        );

        await act(async () => {
          UNSAFE_getAllByType(TapGestureHandler)[1].props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(queryByTestId('MentionTag')).toBeNull();
      });
    });

    describe('when post has mentions', () => {
      it('renders mention tags', async () => {
        setupTimeTravel();
        const mentionedPost: TPost = {
          ...post,
          medias: [
            {
              ...post.medias[0],
              tappableObjects: [
                generateMockTappableObject({ text: `${Math.random()}` }),
              ],
            },
          ],
        };

        const { UNSAFE_getAllByType, getByTestId, getByText } = render(
          <PostItem {...mentionedPost} />,
          options,
        );

        await act(async () => {
          UNSAFE_getAllByType(TapGestureHandler)[1].props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        const mentionTag = getByTestId('MentionTag');
        expect(mentionTag).toBeTruthy();
        expect(
          getByText(mentionedPost.medias[0].tappableObjects[0].text),
        ).not.toBeNull();
        destroyTimeTravel();
      });
    });

    describe('when post has multiple images with mentions', () => {
      it('renders mention tags of tapped image only', async () => {
        setupTimeTravel();
        const mentionedPost: TPost = {
          ...post,
          medias: [
            {
              ...generateMockPostMedia(),
              tappableObjects: [
                generateMockTappableObject({ text: `${Math.random()}` }),
              ],
            },
            {
              ...generateMockPostMedia(),
              tappableObjects: [
                generateMockTappableObject({ text: `${Math.random()}` }),
              ],
            },
          ],
        };

        const { UNSAFE_getAllByType, getByTestId, queryByText } = render(
          <PostItem {...mentionedPost} />,
          options,
        );

        await act(async () => {
          UNSAFE_getAllByType(TapGestureHandler)[1].props.onHandlerStateChange({
            nativeEvent: { state: State.ACTIVE },
          });
        });

        expect(
          queryByText(mentionedPost.medias[0].tappableObjects[0].text),
        ).not.toBeNull();
        expect(
          queryByText(mentionedPost.medias[1].tappableObjects[0].text),
        ).toBeNull();
        destroyTimeTravel();
      });
    });
  });
});
