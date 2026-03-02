import { createSlice } from '@reduxjs/toolkit';

// Get active user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        },
        loginFail: (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { reset, loginSuccess, loginFail, logout } = authSlice.actions;
export default authSlice.reducer;
