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
import { PostItem } from './PostItem';
import { Providers } from '../../Providers';
import {
  generateMockPost,
  generateMockPostMedia,
  generateMockLike,
  generateMockComment,
} from '../../data';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
const useNavigationMock = useNavigation as jest.Mock;

describe('components - PostItem', () => {
  const post = generateMockPost();
  const multiCommentPost = {
    ...post,
    previewComments: {
      count: 2,
      comments: [...Array(2)].map(generateMockComment),
    },
  };
  const options: RenderOptions = { wrapper: Providers };

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
});
