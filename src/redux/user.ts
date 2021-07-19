import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fakeLogin, TFakeLoginResponse } from '../services/user';
import { TUser } from '../types';
import { isFail } from '../utils/remote-data';
import { useAppSelector } from './hooks';

const SLICE_NAME = '@@USER';

export type TUserState = Readonly<{
  user: TUser | null;
  loading: boolean;
  error: string | null;
}>;

export const initialState: TUserState = {
  user: null,
  loading: false,
  error: null,
};

const login = createAsyncThunk<
  TFakeLoginResponse,
  void,
  { rejectValue: string }
>(SLICE_NAME, async (_, { rejectWithValue }) => {
  const user = await fakeLogin();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return isFail(user) ? rejectWithValue(user.error.message) : user.data!;
});

/* eslint-disable no-param-reassign */
export const userSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      });
  },
});
/* eslint-enable no-param-reassign */

export const userReducer = userSlice.reducer;

export const userActions = { ...userSlice.actions, login };

export const useUserSelector = () => useAppSelector(state => state.user);
