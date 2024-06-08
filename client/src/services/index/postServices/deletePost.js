import api from "../../api";

// Function to delete a post given a token and postId
const DeletePost = async (token, postId) => {
  try {
    // Configuration object for the request headers, including the authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Making the DELETE request to the API endpoint with the postId in the URL and configuration
    const { data } = await api.delete(`/api/posts/delete/${postId}`, config);

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

export default DeletePost;
