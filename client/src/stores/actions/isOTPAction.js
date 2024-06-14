import { isOTPAction } from "../reducers/isOTPReducer";

const resetOTP = () => {
  return (dispatch) => {
    dispatch(isOTPAction.resetIsOTP());
    localStorage.removeItem("isOTP");
  };
};

export default resetOTP;
