import { CART_URL } from '../constants';
import { apiSlice } from './apiSlice';

const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => ({
        url: `${CART_URL}`,
        method: 'GET',
      }),
      providesTags: ['Cart'],
      keepUnusedDataFor: 5,
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateMyCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteFromCart: builder.mutation({
      query: (data) => ({
        url: `${CART_URL}`,
        method: 'DELETE',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useUpdateMyCartMutation,
  useDeleteFromCartMutation,
} = cartApiSlice;
