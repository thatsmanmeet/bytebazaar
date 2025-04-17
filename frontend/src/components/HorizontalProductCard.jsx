import React from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { FaTrash } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';

function HorizontalProductCard({
  product,
  qty = 1,
  removeFromCartHandler,
  isDeleting,
}) {
  const deletionHandler = (e) => {
    e.preventDefault();
    removeFromCartHandler(product._id);
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className='flex items-center gap-3 shadow-lg rounded-md p-5 cursor-pointer overflow-hidden'>
        <img src={product.images[0]} alt={product.name} className='w-16 h-16' />
        <div className='flex flex-col'>
          <h2 className='text-sm font-semibold'>{product.name}</h2>
          <div className='flex items-center gap-3 py-1'>
            <span>Price: &#8377;{product.price}</span>
            <span>Quantity: {qty}</span>
          </div>
          <div className='mt-2'>
            <Button
              onClick={deletionHandler}
              className='bg-red-600 hover:bg-red-500 text-white cursor-pointer'
            >
              {isDeleting ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <div className='flex items-center gap-2'>
                  <FaTrash />
                  <span>Remove from cart</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HorizontalProductCard;
