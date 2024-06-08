import api from "../../api";
const login = async ({ userInfo, password }) => {
  try {
    const { data } = await api.post("/api/users/login", {
      userInfo,
      password,
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
export default login;
