import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { passwordRetriesReducer } from "./reducers/passwordRetriesReducer";
import { forgotPasswordRetriesReducer } from "./reducers/forgotPasswordRetriesReducer";
import { isOTPReducer } from "./reducers/isOTPReducer";
// Assuming you have this reducer

// Function to retrieve initial state
const getInitialState = () => {
  const userInfoFromStorage = localStorage.getItem("account")
    ? JSON.parse(localStorage.getItem("account"))
    : null;

  const OTPFromStorage = localStorage.getItem("isOTP")
    ? JSON.parse(localStorage.getItem("isOTP"))
    : false;

  const passwordRetriesFromStorage = localStorage.getItem("passwordRetries")
    ? JSON.parse(localStorage.getItem("passwordRetries"))
    : 10;

  const forgotPasswordRetriesFromStorage = localStorage.getItem(
    "forgotPasswordRetries"
  )
    ? JSON.parse(localStorage.getItem("forgotPasswordRetries"))
    : 5;

  return {
    user: { userInfo: userInfoFromStorage },
    passwordRetries: { passwordRetriesCount: passwordRetriesFromStorage },
    forgotPasswordRetries: {
      forgotPasswordRetriesCount: forgotPasswordRetriesFromStorage,
    },
    isOTPCode: {
      isOTP: OTPFromStorage,
    },
   
  };
};

// Get initial state
const initialState = getInitialState();

// Configure store
const store = configureStore({
  reducer: {
    user: userReducer,
    passwordRetries: passwordRetriesReducer,
    forgotPasswordRetries: forgotPasswordRetriesReducer,
    isOTPCode: isOTPReducer,
  },
  preloadedState: initialState,
});

export default store;
