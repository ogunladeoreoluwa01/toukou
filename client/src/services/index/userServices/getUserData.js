import api from "../../api";

// Function to fetch post data given a token and an userId
const getUserData = async (token, userId) => {
  try {
    // Configuration object for the request headers, including the authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Making the GET request to the API endpoint with the specified userId and configuration
    const { data } = await api.get(`/api/users/getuser/${userId}`, config);

    // Returning the data received from the API
    return data;
  } catch (error) {
    // Enhanced error handling to provide more detailed error messages
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.response) {
      throw new Error(
        `Error: ${error.response.status} ${error.response.statusText}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export default getUserData;
