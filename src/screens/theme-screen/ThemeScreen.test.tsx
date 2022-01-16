import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Providers } from '../../Providers';
import { FakeNavigator } from '../../test/fake-navigator';
import { ThemeScreen } from './ThemeScreen';
import { THEME_VARIANTS } from '../../styles/theme';
import * as reduxHooks from '../../redux/hooks';
import * as reduxThemeVariant from '../../redux/theme-variant';

describe('screens - ThemeScreen', () => {
  const options = { wrapper: Providers };
  const dispatchMock = jest.fn();
  const useDispatchSpy = jest
    .spyOn(reduxHooks, 'useAppDispatch')
    .mockReturnValue(dispatchMock);
  const useThemeVariantSelectorSpy = jest
    .spyOn(reduxThemeVariant, 'useThemeVariantSelector')
    .mockReturnValue(reduxThemeVariant.initialState);
  const changeVariantSpy = jest.spyOn(
    reduxThemeVariant.themeVariantActions,
    'changeVariant',
  );

  afterAll(() => {
    useDispatchSpy.mockRestore();
    useThemeVariantSelectorSpy.mockRestore();
    changeVariantSpy.mockRestore();
  });

  it('renders', () => {
    render(<FakeNavigator component={ThemeScreen} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <FakeNavigator component={ThemeScreen} />,
      options,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it.each([
    ['Light', THEME_VARIANTS.LIGHT],
    ['Dark', THEME_VARIANTS.DARK],
  ])(
    'on %p press dispatches `changeVariant` action with %p payload',
    (text, variant) => {
      const changeVariantAction = Math.random();
      changeVariantSpy.mockReturnValueOnce(changeVariantAction as any);
      const { getByText } = render(
        <FakeNavigator component={ThemeScreen} />,
        options,
      );

      fireEvent.press(getByText(text));

      expect(changeVariantSpy).toHaveBeenCalledTimes(1);
      expect(changeVariantSpy).toHaveBeenLastCalledWith(variant);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenLastCalledWith(changeVariantAction);
    },
  );
});
