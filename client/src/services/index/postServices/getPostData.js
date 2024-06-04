import api from "../../api";

// Function to fetch post data given an authorId and an optional pageParam
const getPostData = async ({ authorId, pageParam = 1 }) => {
  const limit = 10; // Define your limit here

  try {
    // Making the GET request to the API endpoint with the specified authorId and configuration
    const { data } = await api.get(
      `/api/posts/postallUsers/${authorId}?limit=${limit}&page=${pageParam}`
    );

    // Returning the data received from the API
    return data;
  } catch (error) {

    const errorMessage =
      error.response?.data?.message ||
      `Error: ${error.response?.status} ${error.response?.statusText}` ||
      error.message;

    throw new Error(errorMessage);
  }
};

export default getPostData;
