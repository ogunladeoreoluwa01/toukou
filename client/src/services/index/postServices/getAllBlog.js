import api from "../../api";

// Function to fetch post data given a title
const getAllBlog = async (filter) => {
  try {
    // Encode the title parameter to handle spaces and special characters
    let query = filter ? `title=${encodeURIComponent(filter)}` : "";

    console.log(query)
    // Making the GET request to the API endpoint with the specified title
    let { data } = await api.get(`/api/posts/postsFilters?${query}`);

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

export default getAllBlog;
