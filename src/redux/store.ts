import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userReducer } from './user';
import { storiesReducer } from './stories';
import { themeVariantReducer } from './theme-variant';

export const rootReducer = combineReducers({
  user: userReducer,
  stories: storiesReducer,
  themeVariant: themeVariantReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> & {
  // Enforces whitelist to exist in state
  whitelist: (keyof RootState)[];
} = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['themeVariant'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['stories.stories'],
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
