import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import { generateMockComment } from '../../data';
import { Comment } from './Comment';
import { Providers } from '../../Providers';
import { theme } from '../../styles/theme';
import { postLike } from '../../services/likes';
import { flushPromises } from '../../test/flush-promises';
import { makeFail, makeSuccess } from '../../utils/remote-data';

jest.mock('../../services/likes');
const postLikeMock = postLike as jest.MockedFunction<typeof postLike>;

describe('components - Comment', () => {
  const options = { wrapper: Providers };
  const comment = generateMockComment(3);
  const toastSpy = jest.spyOn(Toast, 'show');

  afterAll(() => {
    postLikeMock.mockClear();
    toastSpy.mockRestore();
  });

  it('renders', () => {
    render(<Comment {...comment} />, options);
  });

  it('matches snapshot', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowMock = jest.fn(() => comment.createdAt + 3600 * 1000);
    global.Date.now = dateNowMock;

    const { toJSON } = render(<Comment {...comment} />, options);

    expect(toJSON()).toMatchSnapshot();
    global.Date.now = realDateNow;
  });

  it('inherits style', () => {
    const style = { backgroundColor: 'orange' };
    const { getByTestId } = render(
      <Comment {...comment} style={style} />,
      options,
    );

    expect(getByTestId('Comment')).toHaveStyle(style);
  });

  describe('likes', () => {
    it('renders without likes', () => {
      render(<Comment {...generateMockComment(0)} />, options);
    });

    it('renders singular when 1 like', () => {
      const { getByText } = render(
        <Comment {...generateMockComment(1)} />,
        options,
      );

      expect(getByText('1 like')).toBeTruthy();
    });

    it('renders plural when > 2 likes', () => {
      const { getByText } = render(
        <Comment {...generateMockComment(2)} />,
        options,
      );

      expect(getByText('2 likes')).toBeTruthy();
    });

    describe('when user has liked the post', () => {
      it('renders red heart', () => {
        const { getByTestId } = render(
          <Comment {...comment} viewerHasLiked />,
          options,
        );

        const heartIcon = getByTestId('Comment-Heart');

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      describe('when user press heart icon', () => {
        it('calls postLike service with flag as `false`', async () => {
          const { getByTestId } = render(
            <Comment {...comment} viewerHasLiked />,
            options,
          );

          await act(async () => {
            fireEvent.press(getByTestId('Comment-Heart'));
            await flushPromises();
          });

          expect(postLikeMock).toHaveBeenCalledTimes(1);
          expect(postLikeMock).toHaveBeenCalledWith({
            id: comment.id,
            flag: false,
            collection: 'comments',
          });
        });
      });
    });

    describe('when user press heart icon', () => {
      it('calls postLike service with flag as `true`', async () => {
        const { getByTestId } = render(<Comment {...comment} />, options);

        await act(async () => {
          fireEvent.press(getByTestId('Comment-Heart'));
          await flushPromises();
        });

        expect(postLikeMock).toHaveBeenCalledTimes(1);
        expect(postLikeMock).toHaveBeenCalledWith({
          id: comment.id,
          flag: true,
          collection: 'comments',
        });
      });

      it('changes heart from outline black to filled red', () => {
        const { getByTestId } = render(<Comment {...comment} />, options);

        const heartIcon = getByTestId('Comment-Heart');

        expect(heartIcon.props.color).toBe(theme.color.gray);
        expect(heartIcon.props.fill).toBe('none');

        act(() => {
          fireEvent.press(heartIcon);
        });

        expect(heartIcon.props.color).toBe(theme.color.red);
        expect(heartIcon.props.fill).toBe(theme.color.red);
      });

      it('disables press until request is completed', async () => {
        postLikeMock.mockResolvedValue(makeSuccess(undefined));
        const { getByTestId } = render(<Comment {...comment} />, options);

        const heartIcon = getByTestId('Comment-Heart');

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
          const { getByTestId } = render(<Comment {...comment} />, options);

          await act(async () => {
            fireEvent.press(getByTestId('Comment-Heart'));
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

  describe('when not interactable', () => {
    it('matches snapshot', () => {
      const realDateNow = Date.now.bind(global.Date);
      const dateNowMock = jest.fn(() => comment.createdAt + 3600 * 1000);
      global.Date.now = dateNowMock;

      const { toJSON } = render(
        <Comment {...comment} interactable={false} />,
        options,
      );

      expect(toJSON()).toMatchSnapshot();
      global.Date.now = realDateNow;
    });
  });
});
