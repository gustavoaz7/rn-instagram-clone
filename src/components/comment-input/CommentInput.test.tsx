import React from 'react';
import { TextInput } from 'react-native';
import {
  render,
  RenderOptions,
  fireEvent,
} from '@testing-library/react-native';
import { CommentInput, EMOJIS } from './CommentInput';
import { Providers } from '../../Providers';

describe('components - CommentInput', () => {
  const submitSpy = jest.fn();
  const props = { onSubmit: submitSpy };
  const options: RenderOptions = { wrapper: Providers };

  it('renders', () => {
    render(<CommentInput {...props} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<CommentInput {...props} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders emojis list', () => {
    const { getByText } = render(<CommentInput {...props} />, options);

    EMOJIS.forEach(emoji => {
      expect(getByText(emoji)).toBeTruthy();
    });
  });

  describe('when post button is pressed', () => {
    describe('when text input is not empty', () => {
      it('does not call onSubmit', () => {
        const text = `My number: ${Math.random()}`;
        const { UNSAFE_getByType, getByText } = render(
          <CommentInput {...props} />,
          options,
        );

        const input = UNSAFE_getByType(TextInput);
        fireEvent.changeText(input, text);
        fireEvent.press(getByText('Post'));

        expect(submitSpy).toHaveBeenCalledTimes(1);
        expect(submitSpy).toHaveBeenCalledWith(text);
      });
    });

    describe('when text input is empty', () => {
      it('does not call onSubmit', () => {
        const { getByText } = render(<CommentInput {...props} />, options);

        fireEvent.press(getByText('Post'));

        expect(submitSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('when an emoji is pressed', () => {
    it('appends emoji to text input', () => {
      const prevText = 'My emoji: ';
      const { UNSAFE_getByType, getByText } = render(
        <CommentInput {...props} />,
        options,
      );

      const input = UNSAFE_getByType(TextInput);
      fireEvent.changeText(input, prevText);
      EMOJIS.forEach(emoji => {
        fireEvent.press(getByText(emoji));
      });

      expect(input.props.value).toBe(`${prevText}${EMOJIS.join('')}`);
    });
  });
});
