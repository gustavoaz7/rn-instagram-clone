import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { Navigation } from './navigation/Navigation';
import { useAppDispatch } from './redux/hooks';
import { userActions, userSelectors } from './redux/user';

export const Root = (): JSX.Element => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(userActions.getUser());
  }, [dispatch]);

  const user = userSelectors.useUserSelector();
  const loading = userSelectors.useLoadingSelector();
  const error = userSelectors.useErrorSelector();

  const isAppReady = !loading && !error && user;

  return isAppReady ? <Navigation /> : <AppLoading />;
};
