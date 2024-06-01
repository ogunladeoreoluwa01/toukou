// store.js
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";

// Function to retrieve initial state
const getInitialState = () => {
  const userInfoFromStorage = localStorage.getItem('account')
    ? JSON.parse(localStorage.getItem('account'))
    : null;
  return {
    user: { userInfo: userInfoFromStorage }
  };
};

// Get initial state
const initialState = getInitialState();

// Configure store
const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: initialState
});

export default store;
