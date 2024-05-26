import api from "../api";
const login = async ({ userInfo, password }) => {
  try {
    const { data } = await api.post("/api/users/login", {
      userInfo,
      password,
    });
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};
export default login;
