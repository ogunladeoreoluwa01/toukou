import api from "../../api";

// Function to ban a user given a token, username, ban reason, and ban duration
const banUser = async (token, { username, banReason, banDuration }) => {
  try {
    // Configuration object for the request headers, including the authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Making the POST request to the API endpoint with the username, ban reason, and ban duration in the request body and configuration
    const { data } = await api.post(`/api/users/ban`, { username, banReason, banDuration }, config);

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

export default banUser;
