import api from "../../api";

// Function to fetch post data given an authorId and an optional pageParam
const getAllPostData = async ({  pageParam = 1 }) => {
  const limit = 10;
  const title ="" 
  const sortBy=""
  const date =""

  try {
    // Making the GET request to the API endpoint with the specified authorId and configuration
    const { data } = await api.get(
      `/api/posts/postsFilters?limit=${limit}&page=${pageParam}&title=${title}&sortBy=${sortBy}&date=${date}`
    );

    // Returning the data received from the API
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

export default getAllPostData;
