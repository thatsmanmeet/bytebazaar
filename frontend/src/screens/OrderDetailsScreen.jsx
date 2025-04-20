import React from 'react';
import {
  FiTruck,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiCreditCard,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import { FaBoxOpen } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { ClipLoader } from 'react-spinners';
import Navbar from '@/components/Navbar';
import { useParams } from 'react-router';
import { useGetOrderByIdQuery } from '@/slices/ordersApiSlice';

export default function OrderDetailsScreen() {
  const { id } = useParams();
  const { data: ordersResponse, isLoading, error } = useGetOrderByIdQuery(id);

  if (isLoading) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-gray-100'>
        <ClipLoader size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-gray-100'>
        <p className='text-red-500'>
          {error?.data?.message || 'Failed to load order.'}
        </p>
      </div>
    );
  }

  const order = ordersResponse.data;
  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
  ).toDateString();

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='max-w-4xl mx-auto p-8'>
        {/* Header */}
        <h1 className='text-3xl font-bold mb-1 flex items-center gap-2'>
          <FiClock className='text-blue-500' /> Order Details
        </h1>
        <p className='text-gray-500 mb-6'>Order ID: {order._id}</p>

        {/* Status & Actions */}
        <div className='flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-8'>
          <div className='flex items-center gap-4'>
            {order.isCancelled ? (
              <FiXCircle className='text-red-500 text-2xl' />
            ) : order.isDelivered ? (
              <FiCheckCircle className='text-green-500 text-2xl' />
            ) : (
              <FiTruck className='text-blue-500 text-2xl animate-pulse' />
            )}
            <p className='text-lg font-medium'>
              {order.isCancelled
                ? order.cancelMessage
                  ? `Cancelled: ${order.cancelMessage}`
                  : 'Cancelled by user'
                : order.isDelivered
                ? `Delivered on ${new Date(order.deliveredAt).toDateString()}`
                : `Estimated Delivery by ${estimatedDelivery}`}
            </p>
          </div>
          {!order.isCancelled && !order.isDelivered && (
            <div className='mt-4 sm:mt-0 flex gap-3'>
              <Button className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600'>
                <FiTruck /> Track
              </Button>
              <Button className='flex items-center gap-2 bg-gray-500 hover:bg-gray-600'>
                <FiMail /> Contact
              </Button>
            </div>
          )}
        </div>

        {/* Shipping & Payment */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold mb-2 flex items-center gap-2'>
              <FiMapPin className='text-blue-500' /> Shipping Address
            </h2>
            <p className='text-gray-800'>{order.shippingAddress.house}</p>
            <p className='text-gray-800'>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p className='text-gray-800'>
              {order.shippingAddress.country} — {order.shippingAddress.zipcode}
            </p>
          </div>
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold mb-2 flex items-center gap-2'>
              <FiCreditCard className='text-blue-500' /> Payment Details
            </h2>
            <p className='text-gray-800'>Method: {order.paymentMethod}</p>
            <p className='text-gray-800'>
              Status:{' '}
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toDateString()}`
                : 'Pending'}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <FaBoxOpen className='text-blue-500' /> Items ({order.items.length})
          </h2>
          <div className='divide-y divide-gray-200'>
            {order.items.map((item) => (
              <div
                key={item._id}
                className='flex items-center justify-between py-3'
              >
                <div className='flex items-center'>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className='h-16 w-16 object-cover rounded-md mr-4'
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {item.product.name}
                    </p>
                    <p className='text-gray-500 text-sm'>
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className='font-medium text-gray-800'>
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className='max-w-sm ml-auto mb-8'>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <FiDollarSign className='text-blue-500' /> Order Summary
          </h2>
          <div className='space-y-2 text-gray-800'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className='flex justify-between'>
              <span>Tax:</span>
              <span>₹{order.taxPrice}</span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping:</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div className='flex justify-between font-semibold text-lg mt-2'>
              <span>Total:</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Updates Timeline */}
        <div>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <FiClock className='text-blue-500' /> Order Updates
          </h2>
          {!order.updates.length && (
            <p className='text-gray-500 mb-4'>No updates available.</p>
          )}
          <div className='space-y-6'>
            {order.updates.map((u, idx) => (
              <div key={idx} className='flex items-start'>
                <div className='h-3 w-3 bg-blue-500 rounded-full mt-1 flex-shrink-0'></div>
                <div className='ml-4'>
                  <p className='text-gray-800'>{u.message}</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(u.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
