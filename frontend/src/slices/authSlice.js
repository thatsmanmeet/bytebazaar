import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    setCredentialsOnLogin: (state, action) => {
      state.userInfo = action.payload;
      console.log('CHECk', action.payload);
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    removeCredentialsOnLogout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentialsOnLogin, removeCredentialsOnLogout } =
  authSlice.actions;
export default authSlice.reducer;
