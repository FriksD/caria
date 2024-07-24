import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentAdmin: null,
    loading: false,
    error: false
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminLoginStart: (state) => {
            state.loading = true;
        },
        adminLoginSuccess: (state, action) => {
            state.loading = false;
            state.currentAdmin = action.payload;
        },
        adminLoginFail: (state) => {
            state.loading = false;
            state.error = true;
        },
        adminLogout: (state) => {
            return initialState;
        },
        // 如果需要，可以在这里添加更多的 admin 相关操作
    }
});

export const {adminLoginStart, adminLoginSuccess, adminLoginFail, adminLogout} = adminSlice.actions;

export default adminSlice.reducer;