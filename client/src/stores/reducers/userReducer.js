import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const userInitialState = { userInfo: null };

// Create the user slice
const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        resetUserInfo(state) {
            state.userInfo = null;
        }
    }
});

// Export actions and reducer
const userAction = userSlice.actions;
const userReducer = userSlice.reducer;

export{userAction,userReducer};