import { OrderActionCard } from '@/components/OrdersActionCard';
import ProfileScreen from '@/screens/ProfileScreen';
import {
  useAddOrderUpdatesMutation,
  useCancelOrderBySellerMutation,
  useGetMySellerOrdersQuery,
  useMarkOrderAsDeliveredMutation,
} from '@/slices/ordersApiSlice';
import React from 'react';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

function SellerOrdersScreen() {
  const {
    data: SellerOrdersResponse,
    isLoading,
    error,
    refetch,
  } = useGetMySellerOrdersQuery();

  const [updateOrderAPI, { isLoading: isUpdatingOrder }] =
    useAddOrderUpdatesMutation();
  const [cancelOrderAPI, { isLoading: isCancellingOrder }] =
    useCancelOrderBySellerMutation();

  const [markOrderDeliveredAPI] = useMarkOrderAsDeliveredMutation();

  if (isLoading) {
    return (
      <ProfileScreen>
        <div className='flex items-center justify-center w-full h-full'>
          <ClipLoader size={50} />
        </div>
      </ProfileScreen>
    );
  }

  if (error) {
    return (
      <ProfileScreen>
        <div className='flex items-center justify-center w-full h-full'>
          <p>{error?.message || error?.data?.message || error?.error}</p>
        </div>
      </ProfileScreen>
    );
  }

  const cancelOrderHandler = async (data) => {
    if (!data.id) {
      toast.error('Invalid order ID or order ID not found');
      return;
    }
    if (!data.message) {
      toast.error('Cancel message is required');
      return;
    }
    try {
      const res = await cancelOrderAPI(data).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const updateOrderHandler = async (data) => {
    if (!data.id) {
      toast.error('Invalid order ID or order ID not found');
      return;
    }
    try {
      const res = await updateOrderAPI(data).unwrap();
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const deliverOrderHandler = async (data) => {
    if (!data.id) {
      toast.error('Invalid order ID or order ID not found');
      return;
    }
    try {
      const res = await markOrderDeliveredAPI(data).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const sellerOrders = SellerOrdersResponse.data;

  return (
    <ProfileScreen>
      <div className='w-full sm:min-w-[80vw] p-5 flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Manage Your Orders</h1>
        </div>
        <div className='w-full flex flex-col gap-3 flex-1'>
          {sellerOrders.map((order) => (
            <OrderActionCard
              order={order}
              key={order._id}
              onCancel={(data) => cancelOrderHandler(data)}
              isCancelling={isCancellingOrder}
              onUpdate={(data) => updateOrderHandler(data)}
              isUpdating={isUpdatingOrder}
              onDeliver={(data) => deliverOrderHandler(data)}
            />
          ))}
        </div>
      </div>
    </ProfileScreen>
  );
}

export default SellerOrdersScreen;
