import SearchedProductCard from '@/components/SearchedProductCard';
import { Button } from '@/components/ui/button';
import { useGetAllCategoriesQuery } from '@/slices/categoryApiSlice';
import { useGetProductsQuery } from '@/slices/productApiSlice';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router';
import { ClipLoader } from 'react-spinners';

const CategoryScreen = () => {
  const { id: categoryId } = useParams();
  const {
    data: categoryResponse,
    isLoading,
    error,
  } = useGetAllCategoriesQuery();
  const {
    data: productResponse,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductsQuery();
  const navigate = useNavigate();
  if (isLoading || isProductLoading) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        <ClipLoader size={35} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        {error.data?.message || error.message || error.error}
      </div>
    );
  }

  if (productError) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        {productError.data?.message ||
          productError.message ||
          productError.error}
      </div>
    );
  }

  const currentCategory = categoryResponse.data.filter(
    (category) => category._id.toString() === categoryId
  );

  const products = productResponse.data.filter(
    (product) => product.category.toString() === categoryId.toString()
  );

  return (
    <div className='w-full p-5'>
      <Button
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <FaArrowLeft />
        <span>Back</span>
      </Button>
      <div className='mt-5 flex flex-col gap-2'>
        <h1 className='font-bold text-2xl'>{currentCategory[0].name}</h1>
        <p className='font-semibold text-xl'>
          {currentCategory[0].description}
        </p>
      </div>
      {products.length > 0 ? (
        products.map((product) => (
          <SearchedProductCard product={product} key={product._id} />
        ))
      ) : (
        <div className='w-full min-h-[40vh] flex items-center justify-center'>
          <span className='text-2xl'>No Product Found</span>
        </div>
      )}
    </div>
  );
};

export default CategoryScreen;
