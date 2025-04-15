import Navbar from '@/components/Navbar';
import { useGetAllCategoriesQuery } from '@/slices/categoryApiSlice';
import React from 'react';
import { ClipLoader } from 'react-spinners';

function HomeScreen() {
  const { data: categoryResponse, isLoading } = useGetAllCategoriesQuery();

  if (isLoading) {
    <div className='min-w-screen min-h-screen flex justify-center items-center'>
      <ClipLoader size={35} />
    </div>;
  }

  return (
    <div className='min-w-screen'>
      <Navbar />
    </div>
  );
}

export default HomeScreen;
