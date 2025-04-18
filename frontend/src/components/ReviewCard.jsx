import { Rating } from '@smastrom/react-rating';
import React from 'react';

function ReviewCard({ review }) {
  return (
    <div className='bg-gray-100 p-5 mb-3 rounded-lg flex flex-col gap-1 w-full lg:max-w-xl'>
      <div>
        <p className='text-xl font-bold'>{review.title}</p>
        <Rating style={{ maxWidth: '80px' }} value={review.score} readOnly />
      </div>
      <p>{review.comment}</p>
      <div className='flex items-center gap-1'>
        <p className='text-gray-500 text-sm'>{review.user.name}</p>
        <p className='text-gray-500 text-sm'>
          {new Date(review.updatedAt || review.createdAt).toDateString()}
        </p>
      </div>
    </div>
  );
}

export default ReviewCard;
