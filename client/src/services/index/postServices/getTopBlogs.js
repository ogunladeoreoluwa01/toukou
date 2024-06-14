import api from "../../api";

const TopBlogs = async () => {
  const limit = 8;
  const title = "";
  const sortBy = "likes";
  const date = "";
  const  pageParam = 1 

  try {
    const { data } = await api.get(
      `/api/posts/postsFilters?limit=${limit}&page=${pageParam}&title=${title}&sortBy=${sortBy}&date=${date}`
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

export default TopBlogs;
