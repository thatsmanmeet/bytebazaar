import Navbar from '@/components/Navbar';
import SearchedProductCard from '@/components/SearchedProductCard';
import { useGetProductsQuery } from '@/slices/productApiSlice';
import React from 'react';
import { useSearchParams } from 'react-router';
import { ClipLoader } from 'react-spinners';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const {
    data: productResponse,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductsQuery();

  if (isProductLoading) {
    return (
      <div className='min-w-screen min-h-screen flex justify-center items-center'>
        <ClipLoader size={35} />
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

  const products = productResponse.data.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.content.toLowerCase().includes(query)
  );

  return (
    <>
      <Navbar />
      <div className='w-full p-5'>
        <div className='mt-5 flex flex-col  gap-2'>
          <div>
            <h1 className='font-bold text-2xl'>Search Results for {query}</h1>
            <p className='font-semibold text-xl'>
              {products.length} Search Results found
            </p>
          </div>
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
    </>
  );
}

export default SearchPage;
