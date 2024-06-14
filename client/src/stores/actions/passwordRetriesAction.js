import { passwordRetriesAction } from "../reducers/passwordRetriesReducer";

const resetPassword = () => {
  return (dispatch) => {
    dispatch(passwordRetriesAction.resetPasswordRetriesCount());
    localStorage.removeItem("passwordRetries");
  };
};

export default resetPassword;
