import { Rating } from '@smastrom/react-rating';
import React from 'react';
import { FaBox, FaBuilding, FaComment } from 'react-icons/fa6';
import { Link } from 'react-router';

function SearchedProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`}>
      <div className='flex items-center gap-3 mt-4 p-2 cursor-pointer overflow-hidden border-gray-200 border-b-2'>
        <img src={product.images[0]} alt={product.name} className='w-32 h-32' />
        <div className='w-full flex flex-col sm:flex-row sm:items-center justify-between'>
          <div className='flex flex-col'>
            <h2 className='text-lg font-semibold'>{product.name}</h2>
            <div className='mt-2 mb-2 grid sm:flex grid-cols-2 sm:flex-row sm:items-center gap-1 sm:gap-2'>
              <Rating
                value={product.rating}
                readOnly
                style={{ maxWidth: '80px' }}
              />
              <span className={`font-xs sm:font-xl flex items-center gap-2`}>
                <FaComment />
                {product.numReviews}
              </span>
              <span className={`font-xs sm:font-xl flex items-center gap-2`}>
                <FaBox />
                {product.stock}
              </span>
              <span className={`font-xs sm:font-xl flex items-center gap-2`}>
                <FaBuilding />
                {product.brand}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-3 py-1 mr-3'>
            <span className='text-3xl'>&#8377;{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SearchedProductCard;
