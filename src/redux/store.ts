import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './user';
import { storiesReducer } from './stories';
import { themeVariantReducer } from './theme-variant';

export const rootReducer = combineReducers({
  user: userReducer,
  stories: storiesReducer,
  themeVariant: themeVariantReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });

export type AppDispatch = typeof store.dispatch;
