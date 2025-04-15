import { Rating } from '@smastrom/react-rating';
import React from 'react';
import { Link } from 'react-router';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className='h-full'>
      <div className='shadow-md p-1 rounded-md flex flex-col cursor-pointer h-full'>
        <img
          src={product.images[0]}
          alt={product.name}
          className='w-full h-60 object-contain'
        />
        <div className='p-2 flex flex-col h-full'>
          <h3 className='font-semibold'>{product.name}</h3>
          <div className='flex items-center mt-1'>
            <p className='text-xl font-bold'>&#8377;{product.price}</p>
            <div className='flex items-center gap-2 ml-auto'>
              <Rating
                value={product.rating}
                readOnly
                style={{ maxWidth: '100px' }}
              />
              <span>({product.numReviews})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
