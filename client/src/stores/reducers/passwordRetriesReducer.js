import { createSlice } from "@reduxjs/toolkit";

// Initial state for the password retries slice
const passwordRetriesInitialState = { passwordRetriesCount: 10 };

// Create the password retries slice
const passwordRetriesSlice = createSlice({
  name: "passwordRetries",
  initialState: passwordRetriesInitialState,
  reducers: {
    setPasswordRetriesCount(state, action) {
      state.passwordRetriesCount = action.payload;
    },
    resetPasswordRetriesCount(state) {
      state.passwordRetriesCount = 10;
    },
  },
});

// Export actions and reducer
export const passwordRetriesAction = passwordRetriesSlice.actions;
export const passwordRetriesReducer = passwordRetriesSlice.reducer; // Named export
