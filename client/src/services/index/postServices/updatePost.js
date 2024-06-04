import api from "../../api";

const updatePost = async ({ postId, postData, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await api.put(
      `/api/posts/edit/${postId}`,
      postData,
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

export { updatePost }; // Correct export statement
