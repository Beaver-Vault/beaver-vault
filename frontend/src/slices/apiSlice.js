import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Define the `getUser` endpoint as a query endpoint
    getUser: builder.query({
      query: (email) => {
        console.log("Email:", email);
        return `users/${email}`;
      },
    }),
    // Define the `getFolders` endpoint as a query endpoint
    getFolders: builder.query({
      query: (userID) => `folders/${userID}`,
    }),
    // Define the `getPasswords` endpoint as a query endpoint
    getPasswords: builder.query({
      query: (folderIDs) => `passwords/${folderIDs}`,
    }),
    // Define the `getCreditCards` endpoint as a query endpoint
    getCreditCards: builder.query({
      query: (folderIDs) => `creditcards/${folderIDs}`,
    }),
    // Define the `getNotes` endpoint as a query endpoint
    getNotes: builder.query({
      query: (folderIDs) => `notes/${folderIDs}`,
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetFoldersQuery,
  useGetPasswordsQuery,
  useGetCreditCardsQuery,
  useGetNotesQuery,
} = apiSlice;

export default apiSlice.reducer;

//  `http://localhost:8000/passwords/${folder["folderID"]}`,
// `http://localhost:8000/creditcards/${folder["folderID"]}`,
// `http://localhost:8000/notes/${folder["folderID"]}`,
