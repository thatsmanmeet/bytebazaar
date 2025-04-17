import { CategoryList } from '@/components/CategoryList';
import Navbar from '../components/Navbar';
import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import { useGetProductsQuery } from '@/slices/productApiSlice';
import ProductCards from '@/components/ProductCards';

function HomeScreen() {
  const {
    data: categoryResponse,
    isLoading,
    error,
  } = useGetAllCategoriesQuery();

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    error: productError,
  } = useGetProductsQuery({}, { pollingInterval: 30000 });

  if (isLoading || isProductsLoading) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        <ClipLoader size={35} />
      </div>
    );
  }

  if (error || productError) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        {error.data?.message || error.message}
      </div>
    );
  }

  if (productError) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        {productError.data?.message || productError.message}
      </div>
    );
  }

  return (
    <div className='min-w-screen'>
      <Navbar />
      <CategoryList categories={categoryResponse.data} isLoading={isLoading} />
      <ProductCards products={productsResponse.data} />
    </div>
  );
}

export default HomeScreen;
