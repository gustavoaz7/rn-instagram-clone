import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fakeLogin } from '../api';
import { TUser } from '../types';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@USER';

export type TUserState = Readonly<{
  value: TUser | null;
  loading: boolean;
  error: string | null;
}>;

export const initialState: TUserState = {
  value: null,
  loading: false,
  error: null,
};

const getUser = createAsyncThunk(SLICE_NAME, async (_, { rejectWithValue }) => {
  try {
    const user = await fakeLogin();
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

/* eslint-disable no-param-reassign */
export const userSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUser.pending, state => {
        state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.value = action.payload;
      });
  },
});
/* eslint-enable no-param-reassign */

export const userReducer = userSlice.reducer;

export const userActions = { ...userSlice.actions, getUser };

const useUserSelector = () => useAppSelector(state => state.user.value);
const useLoadingSelector = () => useAppSelector(state => state.user.loading);
const useErrorSelector = () => useAppSelector(state => state.user.error);

export const userSelectors = {
  useUserSelector,
  useLoadingSelector,
  useErrorSelector,
};
