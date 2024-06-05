import api from "../../api";

const createComment = async ({token,commentId }) => {
  try {
    const config = {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    };

    const { data } = await api.delete(
      `/api/comment/delete/${commentId}`,

      config
    );

    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export default createComment;
