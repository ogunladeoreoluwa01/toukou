import api from '../../api';

const signup = async ({ username, email, password }) => {
  try {
    const { data } = await api.post("/api/users/register", {
      username,
      email,
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




export default  signup;
