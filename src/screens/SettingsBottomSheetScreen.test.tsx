import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Providers } from '../Providers';
import { FakeNavigator } from '../test/fake-navigator';
import { SettingsBottomSheetScreen } from './SettingsBottomSheetScreen';
import { SCREEN_HEIGHT } from '../utils/dimensions';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../test/time-travel';
import { theme } from '../styles/theme';
import { PROFILE_STACK_SCREENS } from '../navigation/screens';

jest.mock('@react-navigation/native', () => {
  const reactNavigation = jest.requireActual('@react-navigation/native');
  return {
    ...reactNavigation,
    useNavigation: jest.fn(),
  };
});
const useNavigationMock = useNavigation as jest.Mock;

describe('screens - SettingsBottomSheetScreen', () => {
  const options = { wrapper: Providers };

  it('renders', () => {
    render(<FakeNavigator component={SettingsBottomSheetScreen} />, options);
  });

  describe('on single tap', () => {
    it('navigates back when tap outside', async () => {
      const goBackSpy = jest.fn();
      useNavigationMock.mockReturnValueOnce({ goBack: goBackSpy });
      const height = SCREEN_HEIGHT / 2;
      const { getByTestId, UNSAFE_getByType } = render(
        <FakeNavigator component={SettingsBottomSheetScreen} />,
        options,
      );

      await act(async () => {
        getByTestId('BottomSheet').props.onLayout({
          nativeEvent: { layout: { height } },
        });
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE, absoluteY: height * 0.5 },
        });
      });

      expect(goBackSpy).toHaveBeenCalledTimes(1);
    });

    it('ignores when tap within bottom sheet', async () => {
      const goBackSpy = jest.fn();
      useNavigationMock.mockReturnValueOnce({ goBack: goBackSpy });
      const height = SCREEN_HEIGHT / 2;
      const { getByTestId, UNSAFE_getByType } = render(
        <FakeNavigator component={SettingsBottomSheetScreen} />,
        options,
      );

      await act(async () => {
        getByTestId('BottomSheet').props.onLayout({
          nativeEvent: { layout: { height } },
        });
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE, absoluteY: height * 1.5 },
        });
      });

      expect(goBackSpy).not.toBeCalled();
    });
  });

  describe('on swipe down', () => {
    describe('when swipe is over 20% of content height', () => {
      it('slides content down and navigates back', async () => {
        setupTimeTravel();
        const goBackSpy = jest.fn();
        useNavigationMock.mockReturnValueOnce({ goBack: goBackSpy });
        const height = SCREEN_HEIGHT / 2;
        const translationY = height * 0.21;
        const { getByTestId, UNSAFE_getAllByType } = render(
          <FakeNavigator component={SettingsBottomSheetScreen} />,
          options,
        );

        await act(async () => {
          getByTestId('BottomSheet').props.onLayout({
            nativeEvent: { layout: { height } },
          });
          UNSAFE_getAllByType(PanGestureHandler)[1].props.onGestureEvent({
            nativeEvent: { translationY },
          });
          UNSAFE_getAllByType(PanGestureHandler)[1].props.onHandlerStateChange({
            nativeEvent: { state: State.END, translationY },
          });
        });

        expect(getByTestId('BottomSheet').props.style.transform).toEqual([
          { translateY: translationY },
        ]);
        expect(goBackSpy).not.toBeCalled();

        timeTravel(theme.animation.timingFast);

        expect(getByTestId('BottomSheet').props.style.transform).toEqual([
          { translateY: height },
        ]);
        expect(goBackSpy).toHaveBeenCalledTimes(1);
        destroyTimeTravel();
      });
    });

    describe('when swipe is less than 20% of content height', () => {
      it('brings content back to its original position', async () => {
        setupTimeTravel();
        const goBackSpy = jest.fn();
        useNavigationMock.mockReturnValueOnce({ goBack: goBackSpy });
        const height = SCREEN_HEIGHT / 2;
        const translationY = height * 0.19;
        const { getByTestId, UNSAFE_getAllByType } = render(
          <FakeNavigator component={SettingsBottomSheetScreen} />,
          options,
        );

        await act(async () => {
          getByTestId('BottomSheet').props.onLayout({
            nativeEvent: { layout: { height } },
          });
          UNSAFE_getAllByType(PanGestureHandler)[1].props.onGestureEvent({
            nativeEvent: { translationY },
          });
          UNSAFE_getAllByType(PanGestureHandler)[1].props.onHandlerStateChange({
            nativeEvent: { state: State.END, translationY },
          });
        });

        expect(getByTestId('BottomSheet').props.style.transform).toEqual([
          { translateY: translationY },
        ]);

        timeTravel(1000);

        expect(
          getByTestId('BottomSheet').props.style.transform[0].translateY,
        ).toBeLessThan(1);
        expect(goBackSpy).not.toHaveBeenCalled();
        destroyTimeTravel();
      });
    });
  });

  describe('on `settings` press', () => {
    it('navigates to settings screen', async () => {
      const navigateSpy = jest.fn();
      useNavigationMock.mockReturnValueOnce({ navigate: navigateSpy });
      const { getByText } = render(
        <FakeNavigator component={SettingsBottomSheetScreen} />,
        options,
      );

      fireEvent.press(getByText('Settings'));

      expect(navigateSpy).toBeCalledTimes(1);
      expect(navigateSpy).lastCalledWith(PROFILE_STACK_SCREENS.SETTINGS);
    });
  });
});
