import api from "../api";
const getAuthorProfile = async ({ userInfo, password }) => {
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
export default getAuthorProfile;
