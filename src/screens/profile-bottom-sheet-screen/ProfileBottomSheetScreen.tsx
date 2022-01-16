import React, { useRef, useCallback, useMemo } from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import styled, { useTheme } from 'styled-components/native';
import { SvgProps } from 'react-native-svg';
import { Text } from '../../components/text';
import { SCREEN_HEIGHT } from '../../utils/dimensions';
import SettingsSvg from '../../../assets/svg/settings.svg';
import ArchiveSvg from '../../../assets/svg/counter-clockwise-clock.svg';
import ActivitySvg from '../../../assets/svg/activity-clock.svg';
import QRCodeSvg from '../../../assets/svg/qrcode-scan.svg';
import BookmarkSvg from '../../../assets/svg/bookmark.svg';
import CreditCardSvg from '../../../assets/svg/credit-card.svg';
import { PROFILE_STACK_SCREENS } from '../../navigation/screens';
import { useThemeVariantSelector } from '../../redux/theme-variant';
import { THEME_VARIANTS } from '../../styles/theme';
import { addAlphaToHEX } from '../../utils/color';

export const ProfileBottomSheetScreen = (): JSX.Element => {
  const theme = useTheme();
  const navigation = useNavigation();
  const themeVariant = useThemeVariantSelector();
  const bottomSheetOffsetY = React.useMemo(() => new Animated.Value(0), []);
  const contentHeightRef = useRef(0);
  const gestureHandlerRef = useRef(null);

  const onGestureEventHandler = useCallback(
    ({ nativeEvent: { translationY } }: PanGestureHandlerGestureEvent) => {
      if (translationY > 0) {
        bottomSheetOffsetY.setValue(translationY);
      }
    },
    [bottomSheetOffsetY],
  );

  const onPanStateChangeHandler = useCallback(
    ({
      nativeEvent: { translationY, state },
    }: PanGestureHandlerGestureEvent) => {
      if (state !== State.END) return;

      if (translationY > contentHeightRef.current * 0.2) {
        Animated.timing(bottomSheetOffsetY, {
          toValue: contentHeightRef.current,
          useNativeDriver: true,
          duration: theme.animation.timingFast,
        }).start(navigation.goBack);
      } else {
        Animated.spring(bottomSheetOffsetY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
    [bottomSheetOffsetY, theme.animation, navigation],
  );

  const handleLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      contentHeightRef.current = height;
    },
    [],
  );

  const onTapStateChangeHandler = useCallback(
    (e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
      if (e.nativeEvent.state !== State.ACTIVE) return;
      const isTapOutside =
        e.nativeEvent.absoluteY < SCREEN_HEIGHT - contentHeightRef.current;
      if (isTapOutside) {
        navigation.goBack();
      }
    },
    [navigation],
  );

  const sharedSvgProps: SvgProps = useMemo(
    () => ({
      width: 28,
      height: 28,
      color: theme.color.foreground,
    }),
    [theme.color.foreground],
  );

  const goToSettings = useCallback(() => {
    navigation.navigate(PROFILE_STACK_SCREENS.SETTINGS);
  }, [navigation]);

  return (
    <TapGestureHandler
      onHandlerStateChange={onTapStateChangeHandler}
      waitFor={gestureHandlerRef}
    >
      <FullScreenView>
        <PanGestureHandler
          onGestureEvent={onGestureEventHandler}
          onHandlerStateChange={onPanStateChangeHandler}
          ref={gestureHandlerRef}
        >
          <FullScreenView>
            <BottomSheet
              testID="BottomSheet"
              onLayout={handleLayout}
              themeVariant={themeVariant}
              style={{ transform: [{ translateY: bottomSheetOffsetY }] }}
            >
              <MenuHandle />
              <MenuItemTouchable onPress={goToSettings}>
                <MenuItem>
                  <SettingsSvg {...sharedSvgProps} />
                  <MenuItemText>Settings</MenuItemText>
                </MenuItem>
              </MenuItemTouchable>
              <MenuItemTouchable disabled>
                <MenuItem>
                  <ArchiveSvg {...sharedSvgProps} />
                  <MenuItemText>Archive</MenuItemText>
                </MenuItem>
              </MenuItemTouchable>
              <MenuItemTouchable disabled>
                <MenuItem>
                  <ActivitySvg {...sharedSvgProps} />
                  <MenuItemText>Activity</MenuItemText>
                </MenuItem>
              </MenuItemTouchable>
              <MenuItemTouchable disabled>
                <MenuItem>
                  <QRCodeSvg {...sharedSvgProps} />
                  <MenuItemText>QR code</MenuItemText>
                </MenuItem>
              </MenuItemTouchable>
              <MenuItemTouchable disabled>
                <MenuItem>
                  <BookmarkSvg {...sharedSvgProps} />
                  <MenuItemText>Saved</MenuItemText>
                </MenuItem>
              </MenuItemTouchable>
              <MenuItemTouchable disabled>
                <MenuItem>
                  <CreditCardSvg {...sharedSvgProps} />
                  <MenuItemText>Orders and payments</MenuItemText>
                </MenuItem>
              </MenuItemTouchable>
            </BottomSheet>
          </FullScreenView>
        </PanGestureHandler>
      </FullScreenView>
    </TapGestureHandler>
  );
};

const FullScreenView = styled.View`
  height: 100%;
  width: 100%;
`;

const BottomSheet = styled(Animated.View)<{ themeVariant: THEME_VARIANTS }>`
  background-color: ${({ theme, themeVariant }) =>
    themeVariant === THEME_VARIANTS.LIGHT ? theme.color.white : '#232323'};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const MenuHandle = styled.View`
  height: 4px;
  width: 36px;
  border-radius: 5px;
  margin: ${({ theme }) => theme.spacing.s} auto;
  background-color: ${({ theme }) => theme.color.gray};
`;

const MenuItemTouchable = styled(TouchableHighlight).attrs(({ theme }) => ({
  underlayColor: addAlphaToHEX(theme.color.foreground, 0.1),
}))``;

const MenuItem = styled.View`
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  flex-direction: row;
  align-items: center;
`;

const MenuItemText = styled(Text)`
  margin-left: ${({ theme }) => theme.spacing.s};
`;
