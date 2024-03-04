import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (email) => `users/${email}`,
    }),
  }),
});

export const { useGetUserQuery } = apiSlice;

export default apiSlice.reducer;
