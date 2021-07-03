import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { postsReducer } from './posts';
import { userReducer } from './user';
import { storiesReducer } from './stories';

export const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  stories: storiesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });

export type AppDispatch = typeof store.dispatch;
