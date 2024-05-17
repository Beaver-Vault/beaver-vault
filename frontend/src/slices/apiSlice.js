import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setAccessToken } from "./authSlice";
import axios from "axios";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
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
      `${process.env.REACT_APP_API_URL}/refresh-token`,
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
        url: `passwords`,
        method: "POST",
        body: newPassword,
      }),
    }),
    addCreditCard: builder.mutation({
      query: (newCreditCard) => ({
        url: `creditcards`,
        method: "POST",
        body: newCreditCard,
      }),
    }),
    addNote: builder.mutation({
      query: (newNote) => ({
        url: `notes`,
        method: "POST",
        body: newNote,
      }),
    }),
    addFolder: builder.mutation({
      query: (newFolder) => ({
        url: `folders`,
        method: "POST",
        body: newFolder,
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
      query: ({ creditCardID: id, updatedData: data }) => ({
        url: `creditcards/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateNote: builder.mutation({
      query: ({ notesID, updatedData }) => ({
        url: `notes/${notesID}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userID: id, updatedData: updatedUserData }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: updatedUserData,
      }),
    }),
    // ----- PATCH REQUESTS -----
    updateTrash: builder.mutation({
      query: ({ dataType, dataID, restore }) => ({
        url: `${dataType}/${dataID}`,
        method: "PATCH",
        body: { restore: restore },
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
  useAddFolderMutation,
  useUpdatePasswordMutation,
  useUpdateCreditCardMutation,
  useUpdateNoteMutation,
  useUpdateTrashMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = apiSlice;

export default apiSlice.reducer;

// axios.patch(`${process.env.REACT_APP_API_URL}/${dataType}/${dataID}`
