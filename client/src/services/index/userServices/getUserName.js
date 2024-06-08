import api from "../../api";

// Function to fetch user data given a token and a username
const getUserName = async (token, username) => {
  try {
    // Configuration object for the request headers, including the authorization token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Making the POST request to the API endpoint with the username in the request body and configuration
    const { data } = await api.get(
      `/api/users/getuserbyname`,
      { username },
      config
    );

    // Returning the data received from the API
    return data;
  } catch (error) {
    // Enhanced error handling to provide more detailed error messages
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

export default getUserName;
