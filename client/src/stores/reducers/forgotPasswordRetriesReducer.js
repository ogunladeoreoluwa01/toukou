import { createSlice } from "@reduxjs/toolkit";

// Initial state for the password retries slice
const forgotPasswordRetriesInitialState = {
  forgotPasswordRetriesCount: 5,
};

// Create the password retries slice
const forgotPasswordRetriesSlice = createSlice({
  name: "forgotPasswordRetries",
  initialState: forgotPasswordRetriesInitialState,
  reducers: {
    setForgotPasswordRetriesCount(state, action) {
      state.forgotPasswordRetriesCount = action.payload;
    },
    resetForgotPasswordRetriesCount(state) {
      state.forgotPasswordRetriesCount = 5;
    },
  },
});

// Export actions and reducer
export const forgotPasswordRetriesAction = forgotPasswordRetriesSlice.actions;
export const forgotPasswordRetriesReducer = forgotPasswordRetriesSlice.reducer; // Named export
