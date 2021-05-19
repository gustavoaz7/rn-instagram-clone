import React from 'react';
import { render } from '@testing-library/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AvatarWithRing } from './AvatarWithRing';
import { Providers } from '../../Providers';
import { theme } from '../../styles/theme';

describe('components - AvatarWithRing', () => {
  const options = { wrapper: Providers };
  const props = {
    size: 70,
    color: 'black',
    imageUrl: 'https://cdn.fakercloud.com/avatars/spbroma_128.jpg',
  };

  it('renders', () => {
    render(<AvatarWithRing {...props} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<AvatarWithRing {...props} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for custom ringWidth and offset', () => {
    const { toJSON } = render(
      <AvatarWithRing {...props} offset={5} ringWidth={1} />,
      options,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders ring with provided color', () => {
    const color = 'green';
    const { UNSAFE_getByType } = render(
      <AvatarWithRing {...props} color={color} />,
      options,
    );

    expect(UNSAFE_getByType(LinearGradient).props.colors).toEqual([
      color,
      color,
    ]);
  });

  it('renders gradient ring when "gradient" color is provided', () => {
    const { UNSAFE_getByType } = render(
      <AvatarWithRing {...props} color="gradient" />,
      options,
    );

    expect(UNSAFE_getByType(LinearGradient).props.colors).toEqual([
      theme.color.purpleRed,
      theme.color.yellow,
    ]);
  });
});
