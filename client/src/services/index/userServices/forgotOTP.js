import api from "../../api";

const forgotOTPCode = async (userInfo) => {
  try {
  
    const { data } = await api.post("/api/users/forgotPasswordOTP", {
      userInfo,
    });
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

export default forgotOTPCode;
