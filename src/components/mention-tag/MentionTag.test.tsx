import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MentionTag } from './MentionTag';
import { generateMockTappableObject } from '../../data';
import { Providers } from '../../Providers';

describe('components - MentionTag', () => {
  const options = { wrapper: Providers };
  const tag = generateMockTappableObject();

  it('renders', () => {
    render(<MentionTag {...tag} />, options);
  });

  it('renders provided text', () => {
    const { getByText } = render(<MentionTag {...tag} />, options);

    expect(getByText(tag.text)).toBeTruthy();
  });

  it('applies provided scale', () => {
    const { getByTestId } = render(<MentionTag {...tag} />, options);

    expect(getByTestId('MentionTag').props.style[0]).toEqual(
      expect.objectContaining({
        transform: [{ scale: tag.scale }],
      }),
    );
  });

  it('calls "onPres" prop when pressed', () => {
    const pressSpy = jest.fn();
    const { getByTestId } = render(
      <MentionTag {...tag} onPress={pressSpy} />,
      options,
    );

    fireEvent.press(getByTestId('MentionTag'));

    expect(pressSpy).toHaveBeenCalledTimes(1);
    expect(pressSpy).toHaveBeenCalledWith(tag.text);
  });
});
