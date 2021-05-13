import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { postsReducer } from './posts';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });

export type AppDispatch = typeof store.dispatch;
