import React, { useCallback, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { Alert } from 'react-native';
import { Navigation } from './navigation/Navigation';
import { useAppDispatch } from './redux/hooks';
import { userActions, useUserSelector } from './redux/user';

export const Root = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const login = useCallback(() => dispatch(userActions.login()), [dispatch]);

  useEffect(() => {
    login();
  }, [login]);

  const { user, loading, error } = useUserSelector();

  if (error) {
    Alert.alert(
      'Failed to (fake)Login.',
      'Please make sure server is running and try again.',
      [
        {
          text: 'Retry',
          onPress: login,
        },
      ],
    );
  }

  const isAppReady = !loading && user;

  return isAppReady ? <Navigation /> : <AppLoading />;
};
