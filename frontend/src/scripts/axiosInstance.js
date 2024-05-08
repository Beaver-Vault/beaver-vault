import axios from "axios";

const createAxiosInstance = (accessToken, refreshToken, email) => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log(error);
      const originalRequest = error.config;

      if (error.response.status === 401) {
        try {
          // Make a refresh token request
          const response = await axios.post(
            "http://localhost:8000/refresh-token",
            {
              refreshToken,
              email,
            }
          );

          // Update the access token in the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

          // Retry the original request
          return axios(originalRequest);
        } catch (error) {
          // Handle refresh token request error
          console.error("Error refreshing token:", error);
          return Promise.reject(error);
        }
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
