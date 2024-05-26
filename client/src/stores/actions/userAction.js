// actions/userAction.js

import { userAction } from "../reducers/userReducer";

 const logOut = () => {
  return (dispatch) => {
    dispatch(userAction.resetUserInfo());
    localStorage.removeItem("account");
  };
};

export default logOut;