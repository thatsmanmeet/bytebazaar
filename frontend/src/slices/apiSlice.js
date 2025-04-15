import { BASE_URL } from '../constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { removeCredentialsOnLogout } from './authSlice';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' });

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);

  if (
    result.error &&
    result.error.status === 401 &&
    result.error.data.message === 'jwt expired'
  ) {
    api.dispatch(removeCredentialsOnLogout());
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Product',
    'Order',
    'User',
    'Cart',
    'Address',
    'Category',
    'Reviews',
  ],
  endpoints: () => ({}),
});
