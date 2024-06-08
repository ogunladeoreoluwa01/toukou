import api from "../../api";

// Function to fetch post data given a token and an authorId
const getAPostData = async (postId) => {
  try {
    // Making the GET request to the API endpoint with the specified authorId and configuration
    const { data } = await api.get(`/api/posts/getpost/${postId}`);

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

export default getAPostData;
