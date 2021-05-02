import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Text, TextProps } from './Text';
import { Providers } from '../../Providers';
import { theme } from '../../styles/theme';

describe('components - Text', () => {
  const options: RenderOptions = { wrapper: Providers };
  const text = 'Hello world';

  it('renders', () => {
    render(<Text>Hello</Text>, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<Text>Hello</Text>, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('has color from theme', () => {
    const { getByText } = render(<Text>{text}</Text>, options);

    expect(getByText(text)).toHaveStyle({ color: theme.color.black });
  });

  it('passes props to RN text component', () => {
    const props: TextProps = {
      lineBreakMode: 'clip',
      allowFontScaling: false,
      numberOfLines: 1,
    };
    const { getByText } = render(<Text {...props}>{text}</Text>, options);

    const element = getByText(text);

    expect(element).toBeTruthy();
    Object.entries(props).forEach(([key, value]) => {
      expect(element.props[key]).toEqual(value);
    });
  });
});
