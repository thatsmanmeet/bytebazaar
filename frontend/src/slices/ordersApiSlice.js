import { ORDERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    payForOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/pay/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
    getMySellerOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/seller`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    getSellerOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/seller/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    addOrderUpdates: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${ORDERS_URL}/seller/${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrderBySeller: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/seller/${data.id}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    markOrderAsDelivered: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/seller/deliver/${data.id}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  usePayForOrderMutation,
  useGetMySellerOrdersQuery,
  useGetSellerOrderByIdQuery,
  useAddOrderUpdatesMutation,
  useCancelOrderBySellerMutation,
  useMarkOrderAsDeliveredMutation,
} = orderApiSlice;

export default orderApiSlice;
