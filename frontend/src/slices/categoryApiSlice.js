import { CATEGORY_URL } from '@/constants';
import { apiSlice } from './apiSlice';

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryApiSlice;
