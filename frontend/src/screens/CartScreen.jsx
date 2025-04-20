import HorizontalProductCard from '@/components/HorizontalProductCard';
import { Button } from '@/components/ui/button';
import {
  useDeleteFromCartMutation,
  useGetCartItemsQuery,
} from '@/slices/cartApiSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';

function CartScreen() {
  const navigate = useNavigate();
  const {
    data: cartResponse,
    isLoading: isCartLoading,
    error: cartError,
    refetch: cartRefetch,
  } = useGetCartItemsQuery({}, { refetchOnMountOrArgChange: true });

  const [deleteFromCart, { isLoading: isDeleting }] =
    useDeleteFromCartMutation();

  if (isCartLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <ClipLoader size={50} />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <p>{cartError?.data?.message || cartError?.error}</p>
      </div>
    );
  }

  const removeFromCartHandler = async (productId) => {
    if (!productId) {
      toast.error('Product ID is required.');
    }
    try {
      const res = await deleteFromCart({ product: productId }).unwrap();
      toast.success(res.message);
      cartRefetch();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          'Removing Item from cart failed.'
      );
    }
  };

  return (
    <div className='w-full p-5'>
      <Button
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <FaArrowLeft />
        <span>Back</span>
      </Button>
      <div className='mt-5 w-full grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-3'>
          <h1 className='text-2xl font-bold'>Your Cart</h1>
          <div>
            {cartResponse.data.items.map((item) => (
              <HorizontalProductCard
                key={item.product._id}
                product={item.product}
                qty={item.quantity}
                removeFromCartHandler={(productId) =>
                  removeFromCartHandler(productId)
                }
                isDeleting={isDeleting}
              />
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='bg-gray-100 rounded-md p-4 flex flex-col gap-3'>
            <h3 className='text-2xl font-bold'>Cart Summary</h3>
            <div className='flex items-center gap-4'>
              <span className='text-xl font-semibold'>Items Price: </span>
              <span className='text-xl font-semibold'>
                &#8377;{cartResponse.data.itemsPrice}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-xl font-semibold'>Tax Price: </span>
              <span className='text-xl font-semibold'>
                &#8377;{cartResponse.data.taxPrice} (18% GST)
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-xl font-semibold'>Shipping Price: </span>
              <span className='text-xl font-semibold'>
                &#8377;{cartResponse.data.shippingPrice}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-xl font-semibold'>Total Price: </span>
              <span className='text-xl font-semibold'>
                &#8377;{cartResponse.data.totalPrice}
              </span>
            </div>
            <Button
              onClick={() => navigate('/checkout')}
              className='flex items-center gap-2'
            >
              <FaCreditCard />
              Proceed to checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartScreen;
