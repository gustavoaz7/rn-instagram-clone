import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { generateMockComment } from '../../data';
import { Comment } from './Comment';
import { Providers } from '../../Providers';
import * as reduxHooks from '../../redux/hooks';
import * as reduxComments from '../../redux/comments';
import { theme } from '../../styles/theme';

describe('components - Comment', () => {
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const likeCommentSpy = jest.spyOn(
    reduxComments.commentsActions,
    'likeComment',
  );
  const options = { wrapper: Providers };
  const comment = generateMockComment(3);

  afterAll(() => {
    dispatchMock.mockRestore();
    useDispatchSpy.mockRestore();
    likeCommentSpy.mockRestore();
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
        it('dispatches likeComment action with flag as `false`', async () => {
          const action = Math.random();
          likeCommentSpy.mockReturnValueOnce(action as any);
          const { getByTestId } = render(
            <Comment {...comment} viewerHasLiked />,
            options,
          );

          act(() => {
            fireEvent.press(getByTestId('Comment-Heart'));
          });

          expect(likeCommentSpy).toHaveBeenCalledTimes(1);
          expect(likeCommentSpy).toHaveBeenCalledWith({
            id: comment.id,
            flag: false,
          });
          expect(dispatchMock).toHaveBeenCalledTimes(1);
          expect(dispatchMock).toHaveBeenCalledWith(action);
        });
      });
    });

    describe('when user press heart icon', () => {
      it('dispatches likePost action with flag as `true`', async () => {
        const action = Math.random();
        likeCommentSpy.mockReturnValueOnce(action as any);
        const { getByTestId } = render(<Comment {...comment} />, options);

        act(() => {
          fireEvent.press(getByTestId('Comment-Heart'));
        });

        expect(likeCommentSpy).toHaveBeenCalledTimes(1);
        expect(likeCommentSpy).toHaveBeenCalledWith({
          id: comment.id,
          flag: true,
        });
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(action);
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
