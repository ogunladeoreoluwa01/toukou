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




export default  signup;
