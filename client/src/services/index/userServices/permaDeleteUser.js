import api from "../../api";

const permaDeleteUser = async ({ deleteData, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: deleteData // Add the delete data here for the DELETE request
    };

    const { data } = await api.delete("/api/users/permaDelete", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export default permaDeleteUser;
