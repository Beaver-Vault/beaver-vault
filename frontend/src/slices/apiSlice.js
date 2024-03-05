import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setAccessToken } from "./authSlice";
import axios from "axios";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // If the response status is 401 (Unauthorized), try to get a new token
    const refreshResult = await axios.post(
      "http://localhost:8000/refresh-token",
      {
        email: api.getState().auth.user.email,
        refreshToken: api.getState().auth.refreshToken,
      }
    );
    console.log("REFRESH RESULT:", refreshResult);
    api.dispatch(setAccessToken(refreshResult.data));
    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
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
    // Define add new password endpoint
    addPassword: builder.mutation({
      query: (newPassword) => ({
        url: `passwords/`,
        method: "POST",
        body: newPassword,
      }),
    }),
    addCreditCard: builder.mutation({
      query: (newCreditCard) => ({
        url: `creditcards/`,
        method: "POST",
        body: newCreditCard,
      }),
    }),
    addNote: builder.mutation({
      query: (newNote) => ({
        url: `notes/`,
        method: "POST",
        body: newNote,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetFoldersQuery,
  useGetPasswordsQuery,
  useGetCreditCardsQuery,
  useGetNotesQuery,
  useAddPasswordMutation,
  useAddCreditCardMutation,
  useAddNoteMutation,
} = apiSlice;

export default apiSlice.reducer;
