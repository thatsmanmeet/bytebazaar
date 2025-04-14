import { PRODUCTS_URL, UPLOAD_URL } from '@/constants';
import { apiSlice } from './apiSlice';

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    // Create a new product
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    // Fetch product details by ID
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'GET',
      }),
    }),
    // Update a product by ID (should be a mutation with PUT)
    updateProductById: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Delete a product by ID (should be a mutation with DELETE)
    deleteProductById: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    // Fetch reviews for a product by product ID (adjust URL to /reviews/:id)
    getProductReviews: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/reviews/${id}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 30,
      providesTags: ['Reviews'],
    }),
    // Add a review to a product (using POST to /reviews/:id)
    addProductReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `${PRODUCTS_URL}/reviews/${productId}`,
        method: 'POST',
        body: data,
      }),
    }),
    // Update a review for a product (using PUT to /reviews/:id)
    updateProductReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `${PRODUCTS_URL}/reviews/${productId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Delete a product review (using DELETE to /reviews/:id)
    deleteProductReview: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/reviews/${productId}`,
        method: 'DELETE',
      }),
    }),
    // Upload images
    uploadProductImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useDeleteProductByIdMutation,
  useGetProductReviewsQuery,
  useAddProductReviewMutation,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
  useUploadProductImagesMutation,
} = productApiSlice;

export default productApiSlice;
