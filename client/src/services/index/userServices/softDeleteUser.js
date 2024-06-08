import api from "../../api";

const softDeleteUser = async ({ deleteData, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await api.put(
      "/api/users/softDelete",
      deleteData,
      config
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

export default softDeleteUser;
