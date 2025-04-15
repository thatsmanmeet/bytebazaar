import React from 'react';
import { Skeleton } from './ui/skeleton';

export const CategoryList = ({ categories, isLoading }) => {
  return (
    <div className='w-full'>
      <div className='px-5 py-2 flex items-center gap-5 overflow-y-hidden overflow-x-scroll'>
        {isLoading ? (
          <>
            <Skeleton className={'h-4 w-8'} />
            <Skeleton className={'h-4 w-8'} />
            <Skeleton className={'h-4 w-8'} />
            <Skeleton className={'h-4 w-8'} />
          </>
        ) : (
          categories.map((category) => (
            <div key={category._id}>
              <span className='text-slate-500 hover:text-slate-800 cursor-pointer'>
                {category.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
