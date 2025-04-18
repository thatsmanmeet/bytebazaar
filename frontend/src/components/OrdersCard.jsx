import React from 'react';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';

export function OrderCard({ order, onCancel, isCancelling }) {
  const navigate = useNavigate();

  const orderCanclellationHandler = (orderId) => {
    const confirmPrompt = confirm('Do you want to cancel this order?');
    if (confirmPrompt) {
      onCancel(orderId);
    }
  };

  return (
    <div className=' bg-white rounded-2xl shadow-lg overflow-hidden mb-8'>
      <div className='p-6 flex flex-col sm:flex-row gap-6'>
        <div className='flex-shrink-0'>
          <div className='h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400'>
            {order.items[0].product !== null ? (
              <img src={order.items[0].product.images[0]} />
            ) : (
              <span>IMG</span>
            )}
          </div>
        </div>
        <div className='flex-1'>
          <h2 className='text-2xl font-semibold mb-1'>Order ID: {order._id}</h2>
          <p className='text-gray-600 mb-2'>
            Placed: {new Date(order.createdAt).toDateString()}
          </p>

          <div className='border-t border-b border-gray-200 py-4'>
            {order.items.map((item) => (
              <div key={item._id} className='flex justify-between mb-2'>
                <span className='font-medium text-gray-800'>
                  {item.product?.name || 'Product unavailable'}
                </span>
                <span className='text-gray-500'>x{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className='grid grid-cols-1 gap-1 mt-2'>
            <span>Paid: {order.isPaid ? 'Yes' : 'No'}</span>
            <span>Delivered: {order.isDelivered ? 'Yes' : 'No'}</span>
            <span>Payment Method: {order.paymentMethod}</span>
          </div>

          <p className='mt-4 text-lg font-semibold'>
            Total: ₹{order.totalPrice}
          </p>
          <div className='mt-4 flex items-center gap-4'>
            {!order.isDelivered && (
              <button
                onClick={() => orderCanclellationHandler(order._id)}
                disabled={order.isCancelled}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${
                  order.isCancelled
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {order.isCancelled ? (
                  'Cancelled'
                ) : isCancelling ? (
                  <ClipLoader size={20} />
                ) : (
                  <>
                    <FaTimes /> Cancel
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => {
                navigate(`/orders/${order._id}`);
              }}
              className={`bg-blue-500 hover:bg-blue-600 text-white cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors`}
            >
              <FaInfoCircle /> Details
            </button>
          </div>
        </div>
      </div>
      <div className='bg-gray-50 px-6 py-3 text-gray-600 text-sm'>
        <p>Shipping to:</p>
        <p>
          {order.shippingAddress.house}, {order.shippingAddress.city}
        </p>
        <p>
          {order.shippingAddress.state}, {order.shippingAddress.country}{' '}
          {order.shippingAddress.zipcode}
        </p>
      </div>
    </div>
  );
}
