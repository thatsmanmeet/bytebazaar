import React from 'react';
import ProfileScreen from '../ProfileScreen';
import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from '@/slices/ordersApiSlice';
import { ClipLoader } from 'react-spinners';
import { OrderCard } from '@/components/OrdersCard';
import toast from 'react-hot-toast';

function OrderScreen() {
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetMyOrdersQuery();
  const [cancelMyOrderAPI, { isLoading: isOrderCancelling }] =
    useCancelOrderMutation();

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

  const orderCancellationHandler = async (orderId) => {
    if (!orderId) {
      toast.error('Order ID is required');
      return;
    }
    try {
      const res = await cancelMyOrderAPI(orderId).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || error?.error);
    }
  };

  return (
    <ProfileScreen>
      <div className='w-full sm:min-w-[80vw] p-5 flex flex-col gap-3'>
        <h1 className='text-2xl font-bold'>Your Orders</h1>
        <div className='w-full flex flex-col gap-3 flex-1'>
          {ordersResponse.data.map((order) => (
            <OrderCard
              order={order}
              key={order._id}
              onCancel={(orderId) => orderCancellationHandler(orderId)}
              isCancelling={isOrderCancelling}
            />
          ))}
        </div>
      </div>
    </ProfileScreen>
  );
}

export default OrderScreen;
