import { Rating } from '@smastrom/react-rating';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

function ReviewActionCard({
  review,
  deleteHandler,
  updateHandler,
  isDeleting,
  isUpdating,
}) {
  const [isEditingFormOpen, setIsEditingFormOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState({
    score: null,
    title: null,
    comment: null,
  });

  useEffect(() => {
    setReviewContent({
      score: review.score,
      title: review.title ?? null,
      comment: review.comment ?? null,
    });
  }, [review]);

  const handleRatingChange = (selectedValue) => {
    setReviewContent((prev) => ({ ...prev, score: selectedValue }));
  };

  const deleteBtnHandler = (productId) => {
    const confirmDelete = confirm('Would you like to delete this review?');
    if (confirmDelete) {
      deleteHandler(productId);
    }
  };

  const updateButtonHandler = (productId) => {
    updateHandler(productId, reviewContent);
    setIsEditingFormOpen(false);
  };

  return (
    <div className='bg-gray-100 p-5 mb-3 rounded-lg flex flex-col gap-1 w-full '>
      <div>
        <p className='text-xl font-bold'>{review.title}</p>
        <Rating style={{ maxWidth: '80px' }} value={review.score} readOnly />
      </div>
      <p>{review.comment}</p>
      <div className='flex items-center gap-1'>
        <p className='text-gray-600 text-sm my-3'>
          You {!review.comment && !review.title ? 'rated' : 'reviewed'} the
          product{' '}
          <Link to={`/product/${review.product._id}`}>
            <span className='font-bold hover:underline'>
              {review.product.name.length > 50
                ? review.product.name.substr(0, 50) + '...'
                : review.product.name}
            </span>
          </Link>
          {' on '}
          {new Date(review.updatedAt || review.createdAt).toDateString()}
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <Button
          onClick={() => setIsEditingFormOpen((prev) => !prev)}
          className='cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-600'
        >
          <FaPencil /> Edit
        </Button>
        <Button
          onClick={() => deleteBtnHandler(review.product._id)}
          className='cursor-pointer bg-red-500 hover:bg-red-600'
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ClipLoader size={20} />
          ) : (
            <div className='flex items-center gap-2'>
              <FaTrash /> Delete
            </div>
          )}
        </Button>
      </div>
      {isEditingFormOpen && (
        <div className='p-1 flex flex-col gap-2'>
          <h3 className='font-semibold my-2'>Edit Review</h3>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Select Rating</p>
            <Rating
              style={{ maxWidth: '100px' }}
              value={reviewContent.score}
              onChange={handleRatingChange}
            />
          </div>
          <Input
            placeholder='Title of the review'
            className='p-3'
            value={reviewContent.title}
            onChange={(e) =>
              setReviewContent((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
          <Textarea
            placeholder='What do you think about this product?'
            className='p-3'
            value={reviewContent.comment}
            onChange={(e) =>
              setReviewContent((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
          />
          <Button
            onClick={() => updateButtonHandler(review.product._id)}
            disabled={isUpdating}
          >
            {isUpdating ? <ClipLoader size={20} /> : <span>Submit</span>}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReviewActionCard;
