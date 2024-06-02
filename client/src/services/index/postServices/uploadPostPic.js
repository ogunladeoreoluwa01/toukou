import api from "../../api";

const uploadPostPic = async ({ token, formData,postId }) => {
  try {
    const config = {
      headers: {
        "content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await api.put(
     `/api/posts/uploadpostimg/${postId}`,
      formData,
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

export default uploadPostPic;
