import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import { Text, TextProps } from './Text';
import { Providers } from '../../Providers';
import { theme, THEME_VARIANTS } from '../../styles/theme';

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

  it.each([THEME_VARIANTS.LIGHT, THEME_VARIANTS.DARK])(
    'uses foreground color for %p theme',
    variant => {
      const { getByText } = render(
        <ThemeProvider theme={theme[variant]}>
          <Text>{text}</Text>
        </ThemeProvider>,
        options,
      );

      expect(getByText(text)).toHaveStyle({
        color: theme[variant].color.foreground,
      });
    },
  );

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
