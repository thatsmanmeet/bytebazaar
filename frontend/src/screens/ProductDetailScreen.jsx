import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAddToCartMutation } from '@/slices/cartApiSlice';
import {
  useAddProductReviewMutation,
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
} from '@/slices/productApiSlice';
import { Rating } from '@smastrom/react-rating';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaCartShopping,
  FaMinus,
  FaPencil,
  FaPlus,
  FaTrashCan,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { ClipLoader } from 'react-spinners';

function ProductDetailScreen() {
  const { id: productId } = useParams();
  const { userInfo } = useSelector((store) => store.auth);
  const {
    data: productResponse,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId);

  const {
    data: reviewsResponse,
    isLoading: isReviewsLoading,
    error: reviewsError,
    refetch: reviewRefetch,
  } = useGetProductReviewsQuery(productId);

  const [addReview, { isLoading: isReviewAdding }] =
    useAddProductReviewMutation();

  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  const [selectedImage, setSelectedImage] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [reviewContent, setReviewContent] = useState({
    score: null,
    title: null,
    comment: null,
  });
  const [currentStock, setCurrentStock] = useState(1);

  useEffect(() => {
    if (!isLoading && !error) {
      setSelectedImage(productResponse.data.images[0]);
    }
  }, [isLoading, error, productResponse]);

  useEffect(() => {
    if (userInfo && !reviewsError && !isReviewsLoading) {
      const myReview = reviewsResponse.data.filter(
        (review) => review.user._id.toString() === userInfo._id
      );
      if (myReview.length > 0) {
        setUserReview(myReview);
      }
    }
  }, [isReviewsLoading, reviewsError, userInfo, reviewsResponse]);

  if (isLoading || isReviewsLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen min-w-full'>
        <ClipLoader size={50} />
      </div>
    );
  }

  if (error || reviewsError) {
    return (
      <div className='flex items-center justify-center min-h-screen min-w-full'>
        <p>{error?.data?.message || error?.message || error?.error}</p>
      </div>
    );
  }

  const handleRatingChange = (selectedValue) => {
    setReviewContent((prev) => ({ ...prev, score: selectedValue }));
  };

  const addReviewHandler = async () => {
    if (!reviewContent.score) {
      toast.error('Rating is required');
      return;
    }
    try {
      const res = await addReview({ ...reviewContent, productId }).unwrap();
      toast.success(res.message);
      reviewRefetch();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          'Something went wrong creating review'
      );
    }
  };

  const addToCartHandler = async () => {
    if (!userInfo) {
      toast.error('Please login to add item to cart');
      return;
    }
    try {
      const res = await addToCart({
        product: productResponse.data._id,
        quantity: currentStock,
      }).unwrap();

      toast.success(res.message);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          'Something went wrong adding product to cart'
      );
    }
  };

  const totalReviews = reviewsResponse.data.length;
  const ratingCounts = {
    5: reviewsResponse.data.filter((review) => Math.floor(review.score) === 5)
      .length,
    4: reviewsResponse.data.filter((review) => Math.floor(review.score) === 4)
      .length,
    3: reviewsResponse.data.filter((review) => Math.floor(review.score) === 3)
      .length,
    2: reviewsResponse.data.filter((review) => Math.floor(review.score) === 2)
      .length,
    1: reviewsResponse.data.filter((review) => Math.floor(review.score) === 1)
      .length,
  };

  return (
    <div className='min-h-screen min-w-full overflow-hidden'>
      <Navbar />
      <div className='p-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='w-full flex flex-col items-center'>
            <img
              src={selectedImage}
              className='w-full max-w-[500px] rounded-md mt-5 mb-2 object-contain max-h-[500px]'
              alt=''
            />
            <div className='p-5 flex rounded-md items-center gap-3 overflow-x-auto w-full max-w-[500px] scrollbar-hide'>
              {productResponse.data.images.map((image) => (
                <div
                  onClick={() => setSelectedImage(image)}
                  className={`w-24 h-24 border-2 cursor-pointer rounded-md p-1 flex items-center justify-center ${
                    selectedImage === image
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}
                  key={image}
                >
                  <img
                    src={image}
                    alt=''
                    className='w-full h-full object-contain rounded-md'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='p-2 flex flex-col w-full lg:max-w-xl mx-auto'>
            <div className='mt-10 mb-2 font-semibold'>
              {productResponse.data.brand}
            </div>
            <div>
              <h2 className='text-xl sm:text-2xl font-bold'>
                {productResponse.data.name}
              </h2>
              <div className='flex items-center gap-3 mt-1'>
                <Rating
                  value={productResponse.data.rating}
                  readOnly
                  style={{ maxWidth: '100px' }}
                />
                <span className='text-slate-600'>
                  {productResponse.data.numReviews} Reviews
                </span>
                <p className='text-slate-600 text-md'>
                  Stocks:{' '}
                  {productResponse.data.stock > 0
                    ? productResponse.data.stock
                    : 'Out Of Stock'}
                </p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-3xl font-bold'>
                &#8377;{productResponse.data.price}
              </p>
            </div>
            <div className='mt-5'>
              <h3 className='font-bold'>About this Item:</h3>
              <p>{productResponse.data.content}</p>
            </div>
            <div className='flex items-center gap-3 mt-12'>
              <div className='flex items-center gap-3'>
                <FaMinus
                  className='bg-gray-200 rounded-full cursor-pointer p-2 w-8 h-8'
                  onClick={() => {
                    if (currentStock > 1) {
                      setCurrentStock((prev) => prev - 1);
                    } else {
                      setCurrentStock(1);
                    }
                  }}
                />
                <span className='text-xl font-bold select-none'>
                  {currentStock}
                </span>
                <FaPlus
                  className='bg-gray-200 rounded-full cursor-pointer p-2 w-8 h-8'
                  onClick={() => {
                    if (currentStock < productResponse.data.stock) {
                      setCurrentStock((prev) => prev + 1);
                    } else {
                      setCurrentStock(productResponse.data.stock);
                    }
                  }}
                />
              </div>
              <button
                onClick={addToCartHandler}
                className='w-full  px-0 py-3 rounded-lg bg-black text-white flex items-center gap-3 justify-center cursor-pointer'
              >
                <FaCartShopping />
                {addingToCart ? (
                  <ClipLoader size={30} color='#fff' />
                ) : (
                  <span className='select-none'>Add to Cart</span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 mt-5 gap-5'>
          <div>
            <h3 className='text-xl font-semibold mb-4 order-last sm:order-first ml-2'>
              Customer Reviews
            </h3>
            {userInfo && (
              <>
                {userReview ? (
                  <div className='rounded-lg w-full md:max-w-xl mb-5 bg-gray-100 flex flex-col gap-2'>
                    <div className=' mx-4 mt-3'>
                      <p>
                        You have already reviewed this product. Go to your
                        profile to view, edit and delete your reviews.
                      </p>
                    </div>
                    <ReviewCard review={userReview[0]} />
                  </div>
                ) : (
                  <div className='flex flex-col  gap-4 p-3 my-2 w-full md:max-w-lg'>
                    <div className='flex items-center gap-3'>
                      <span className='text-xl font-semibold'>
                        Select Rating{' '}
                      </span>
                      <Rating
                        style={{ maxWidth: '200px' }}
                        value={reviewContent.score}
                        onChange={handleRatingChange}
                      />
                    </div>
                    <Input
                      className={'p-5'}
                      placeholder='Title of comment'
                      value={setReviewContent.title}
                      onChange={(e) =>
                        setReviewContent((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                    <Textarea
                      className={'p-5'}
                      placeholder='What do you think about this product?'
                      value={setReviewContent.comment}
                      onChange={(e) =>
                        setReviewContent((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                    />
                    <Button onClick={addReviewHandler}>
                      {!isReviewAdding ? (
                        <span>Add Review</span>
                      ) : (
                        <ClipLoader color='#fff' size={25} />
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
            <div>
              {userInfo && userReview && userReview[0]
                ? reviewsResponse.data
                    .filter((review) => review.comment !== undefined)
                    .filter(
                      (review) =>
                        review.user._id.toString() !==
                        userReview[0].user._id.toString()
                    )
                    .map((review) => (
                      <ReviewCard review={review} key={review._id} />
                    ))
                : reviewsResponse.data
                    .filter(
                      (review) =>
                        review.comment !== undefined || review.comment === null
                    )
                    .map((review) => (
                      <ReviewCard review={review} key={review._id} />
                    ))}
            </div>
          </div>
          <div className='flex flex-col gap-3 p-5 rounded-lg order-first sm:order-last w-full md:max-w-xl mx-auto bg-gray-100'>
            <h3 className='text-xl font-semibold mb-1'>
              Average Rating: {productResponse.data.rating}
            </h3>
            <Rating
              value={productResponse.data.rating}
              style={{ maxWidth: '200px' }}
              readOnly
            />
            <div className='w-full flex flex-col gap-5'>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star];
                const percent =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className='w-full flex items-center gap-5'>
                    <span>{star} Stars</span>
                    <Progress value={percent} className='w-64 md:w-80' />
                    <span>({count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailScreen;
