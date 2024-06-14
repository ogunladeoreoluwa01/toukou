import { forgotPasswordRetriesAction } from "../reducers/forgotPasswordRetriesReducer";

const resetForgotPassword = () => {
  return (dispatch) => {
    dispatch(forgotPasswordRetriesAction.resetForgotPasswordRetriesCount());
    localStorage.removeItem("forgotPasswordRetries");
  };
};

export default resetForgotPassword;
