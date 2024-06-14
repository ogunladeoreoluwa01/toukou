import api from "../../api";
const changePasswordFn = async ({
  OTPCode,
  oldPassword,
  newPassword,
  token,
}) => {
  try {
    // Configure headers for authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // Make API request to change password
    const { data } = await api.put(
      "/api/users/changePassword",
      {
        OTPCode,
        oldPassword,
        newPassword,
      },
      config
    );
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
export default changePasswordFn;




