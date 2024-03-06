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
    console.log("New Refresh Token: ", refreshResult.data);
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
    // ----- GET REQUESTS -----
    getUser: builder.query({
      query: (email) => `users/${email}`,
    }),
    getFolders: builder.query({
      query: (userID) => `folders/${userID}`,
    }),
    getPasswords: builder.query({
      query: (folderIDs) => `passwords/${folderIDs}`,
    }),
    getCreditCards: builder.query({
      query: (folderIDs) => `creditcards/${folderIDs}`,
    }),
    getNotes: builder.query({
      query: (folderIDs) => `notes/${folderIDs}`,
    }),
    // ----- POST REQUESTS -----
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
    // ----- PUT REQUESTS -----
    updatePassword: builder.mutation({
      query: ({ id: passwordID, updatedPasswordData: updatedData }) => ({
        url: `passwords/${passwordID}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    updateCreditCard: builder.mutation({
      query: ({ creditCardID, updatedData }) => ({
        url: `creditcards/${creditCardID}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    updateNote: builder.mutation({
      query: ({ notesID, updatedData }) => ({
        url: `notes/${notesID}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    // ----- DELETE REQUESTS -----
    deleteUser: builder.mutation({
      query: ({ dataType, dataID }) => ({
        url: `${dataType}/${dataID}`,
        method: "DELETE",
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
  useUpdatePasswordMutation,
  useUpdateCreditCardMutation,
  useUpdateNoteMutation,
  useDeleteUserMutation,
} = apiSlice;

export default apiSlice.reducer;

// GET
// `http://localhost:8000/creditcards/${currentFolder}`,
// `http://localhost:8000/passwords/${currentFolder}`,
// `http://localhost:8000/notes/${currentFolder}`,

// PUT
// http://localhost:8000/passwords/${id}`,
// `http://localhost:8000/notes/${id}`,
//  `http://localhost:8000/creditcards/${id}`,
