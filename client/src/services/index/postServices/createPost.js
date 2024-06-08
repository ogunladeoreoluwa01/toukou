import api from '../../api';

const createPost = async ({ token, title, content }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await api.post("/api/posts/create", { 
      title,
      content,
    }, config);

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

export default createPost;
