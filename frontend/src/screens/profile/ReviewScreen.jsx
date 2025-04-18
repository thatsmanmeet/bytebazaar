import React from 'react';
import ProfileScreen from '../ProfileScreen';
import {
  useDeleteProductReviewMutation,
  useGetMyReviewsQuery,
  useUpdateProductReviewMutation,
} from '@/slices/productApiSlice';
import { ClipLoader } from 'react-spinners';
import ReviewActionCard from '@/components/ReviewActionCard';
import toast from 'react-hot-toast';

function ReviewScreen() {
  const {
    data: myReviewsResponse,
    isLoading,
    error,
    refetch,
  } = useGetMyReviewsQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteReviewAPI, { isLoading: isDeleting }] =
    useDeleteProductReviewMutation();

  const [updateReviewAPI, { isLoading: isUpdating }] =
    useUpdateProductReviewMutation();

  const reviewDeletionHandler = async (productId) => {
    if (!productId) {
      toast.error('Review ID is required');
      return;
    }
    try {
      const res = await deleteReviewAPI(productId).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || error?.error);
    }
  };

  const updateReviewHandler = async (productId, reviewContent) => {
    if (!productId) {
      toast.error('Review ID is required');
      return;
    }
    if (!reviewContent.score) {
      toast.error('Rating is required');
      return;
    }
    try {
      const res = await updateReviewAPI({
        ...reviewContent,
        productId,
      }).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          'Something went wrong updating review'
      );
    }
  };

  if (isLoading) {
    return (
      <ProfileScreen>
        <div className='w-full min-h-screen flex items-center justify-center'>
          <ClipLoader size={50} />
        </div>
      </ProfileScreen>
    );
  }

  if (error) {
    return (
      <ProfileScreen>
        <div className='w-full min-h-screen flex items-center justify-center'>
          <p>{error?.data?.message || error?.error}</p>
        </div>
      </ProfileScreen>
    );
  }

  return (
    <ProfileScreen>
      <div className='p-5 flex flex-col gap-3'>
        <h1 className='text-2xl font-bold'>Reviews</h1>
        <div>
          {myReviewsResponse.data.map((review) => (
            <ReviewActionCard
              review={review}
              key={review._id}
              deleteHandler={(productId) => reviewDeletionHandler(productId)}
              updateHandler={(productId, reviewContent) =>
                updateReviewHandler(productId, reviewContent)
              }
              isDeleting={isDeleting}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      </div>
    </ProfileScreen>
  );
}

export default ReviewScreen;
