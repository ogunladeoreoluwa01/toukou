import api from "../../api";
const forgotPasswordFn = async ({ newPassword, OTPCode, userInfo }) => {
  try {
    // Make API request to change password
    const { data } = await api.post("/api/users/forgotpassword", {
      newPassword,
      OTPCode,
      userInfo,
    });
    // Return the response data
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        JSON.stringify({
          errorCode: error.response.status,
          errorMessage: error.response.data.message,
        })
      );
    } else {
      throw new Error(error.message);
    }
  }
};
export default forgotPasswordFn;
