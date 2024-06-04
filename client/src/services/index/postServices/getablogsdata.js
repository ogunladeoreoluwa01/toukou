import api from "../../api";

// Function to fetch post data given a token and an authorId
const getAPostData = async ( postId) => {
  try {

    // Making the GET request to the API endpoint with the specified authorId and configuration
    const { data } = await api.get(`/api/posts/getpost/${postId}`, );
    
    // Returning the data received from the API
    return data;
  } catch (error) {
    // Enhanced error handling to provide more detailed error messages
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.response) {
      throw new Error(`Error: ${error.response.status} ${error.response.statusText}`);
    } else {
      throw new Error(error.message);
    }
  }
};

export default getAPostData;