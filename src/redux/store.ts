import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { postsReducer } from './posts';
import { commentsReducer } from './comments';
import { userReducer } from './user';

export const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  comments: commentsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });

export type AppDispatch = typeof store.dispatch;
