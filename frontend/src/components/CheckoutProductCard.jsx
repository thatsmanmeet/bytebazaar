import React from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { FaTrash } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';

function CheckoutProductCard({ product, qty = 1 }) {
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
        </div>
      </div>
    </Link>
  );
}

export default CheckoutProductCard;
