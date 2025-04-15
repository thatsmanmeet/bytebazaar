import React from 'react';
import ProductCard from './ProductCard';

const ProductCards = ({ products }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-10 my-15'>
      {products.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </div>
  );
};

export default ProductCards;
