import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { Providers } from '../../Providers';
import { FakeNavigator } from '../../test/fake-navigator';
import { SettingsScreen } from './SettingsScreen';
import { PROFILE_STACK_SCREENS } from '../../navigation/screens';

jest.mock('@react-navigation/native', () => {
  const reactNavigation = jest.requireActual('@react-navigation/native');
  return {
    ...reactNavigation,
    useNavigation: jest.fn(),
  };
});
const useNavigationMock = useNavigation as jest.Mock;

describe('screens - SettingsScreen', () => {
  const options = { wrapper: Providers };

  it('renders', () => {
    render(<FakeNavigator component={SettingsScreen} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <FakeNavigator component={SettingsScreen} />,
      options,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  describe('on `theme` press', () => {
    it('navigates to theme screen', () => {
      const navigateSpy = jest.fn();
      useNavigationMock.mockReturnValueOnce({ navigate: navigateSpy });
      const { getByText } = render(
        <FakeNavigator component={SettingsScreen} />,
        options,
      );

      fireEvent.press(getByText('Theme'));

      expect(navigateSpy).toBeCalledTimes(1);
      expect(navigateSpy).lastCalledWith(PROFILE_STACK_SCREENS.THEME);
    });
  });
});
