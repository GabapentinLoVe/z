import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'QA Engineer'
  | 'Designer'
  | 'Manager'
  | 'HR';

export interface User {
  id: string;
  nickname: string;
  role: UserRole;
  token: string;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    register(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

export const { login, logout, register } = userSlice.actions;
export default userSlice.reducer; 