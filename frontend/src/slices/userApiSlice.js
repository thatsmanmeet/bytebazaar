import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'DELETE',
        body: data,
      }),
    }),
    getUserAddress: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile/address`,
        method: 'GET',
      }),
      providesTags: ['Address'],
      keepUnusedDataFor: 5,
    }),
    addUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/address`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/address`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteUserAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/address`,
        method: 'DELETE',
        body: data,
      }),
    }),
    becomeSeller: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/seller`,
        method: 'POST',
        body: data,
      }),
    }),
    updateSellerInfo: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/seller`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updateRefreshToken: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/refreshToken`,
        method: 'POST',
      }),
    }),
    // Additional endpoints for leftover routes
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgotpassword`,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      // Expects an object containing a token and other required data (e.g. new password)
      query: ({ token, ...data }) => ({
        url: `${USERS_URL}/resetpassword/${token}`,
        method: 'POST',
        body: data,
      }),
    }),
    enableTwoFactor: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/2fa/enable`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyTwoFactor: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/2fa/verify`,
        method: 'POST',
        body: data,
      }),
    }),
    disableTwoFactor: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/2fa/disable`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
  useGetUserAddressQuery,
  useAddUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useBecomeSellerMutation,
  useUpdateSellerInfoMutation,
  useUpdateRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useEnableTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
} = userApiSlice;
