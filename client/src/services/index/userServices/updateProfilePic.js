import api from "../../api";

const updateUserProfilePic = async ({ token, formData }) => {
  try {
    const config = {
      headers: {
        "content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await api.post(
      "/api/users/uploadProfileImg",
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

export default updateUserProfilePic;
