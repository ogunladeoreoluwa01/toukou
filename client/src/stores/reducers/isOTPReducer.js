import { createSlice } from "@reduxjs/toolkit";

// Initial state for the OTP slice
const isOTPInitialState = {
  isOTP: false,
};

// Create the OTP slice
const isOTPSlice = createSlice({
  name: "isOTP",
  initialState: isOTPInitialState,
  reducers: {
    setOTP(state, action) {
      state.isOTP = action.payload;
    },
    resetIsOTP(state) {
      state.isOTP = false;
    },
  },
});

// Export actions and reducer
export const isOTPAction = isOTPSlice.actions;
export const isOTPReducer = isOTPSlice.reducer;
