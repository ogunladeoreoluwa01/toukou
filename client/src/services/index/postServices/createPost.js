import api from '../../api';

const createPost = async ({ token, title, content }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await api.post("/api/posts/create", { // Corrected endpoint
      title,
      content,
    }, config);

    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export default createPost;
