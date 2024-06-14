import api from "../../api";

// Function to reactivate a user account
const reactivateUser = async ({ userInfo, password }) => {
  try {
    const { data } = await api.put(
      "/api/users/unSoftDelete",
      { userInfo, password },

    );
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

export default reactivateUser;
