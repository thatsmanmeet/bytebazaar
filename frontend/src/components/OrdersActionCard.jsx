import React, { useState } from 'react';
import { FaCheck, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function OrderActionCard({
  order,
  onCancel,
  isCancelling,
  onUpdate,
  isUpdating,
  onDeliver,
}) {
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const orderDeliveredHandler = (id) => {
    const confirmPrompt = confirm('Is this order delivered?');
    if (confirmPrompt) {
      onDeliver({ id });
    }
  };

  const openCancelModal = () => {
    setCancelMessage('');
    setCancelOpen(true);
  };

  const confirmCancel = (data) => {
    if (cancelMessage.trim() !== '') {
      onCancel(data);
      setCancelOpen(false);
    }
  };

  const openUpdateModal = () => {
    setUpdateMessage('');
    setUpdateOpen(true);
  };

  const confirmUpdate = (data) => {
    if (updateMessage !== '') {
      onUpdate(data);
      setUpdateOpen(false);
    }
  };

  return (
    <>
      {/* Cancel Modal */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={cancelMessage}
            onChange={(e) => setCancelMessage(e.target.value)}
            placeholder='Enter cancellation message...'
            className='w-full mt-2'
          />
          <DialogFooter>
            <Button variant='ghost' onClick={() => setCancelOpen(false)}>
              Close
            </Button>
            <Button
              disabled={isCancelling || !cancelMessage.trim()}
              onClick={() =>
                confirmCancel({ id: order._id, message: cancelMessage })
              }
            >
              {isCancelling ? <ClipLoader size={16} /> : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Update</DialogTitle>
            <DialogDescription>
              Please provide an update message.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
            placeholder='Enter update message...'
            className='w-full mt-2'
          />
          <DialogFooter>
            <Button variant='ghost' onClick={() => setUpdateOpen(false)}>
              Close
            </Button>
            <Button
              disabled={isUpdating || !updateMessage.trim()}
              onClick={() =>
                confirmUpdate({ id: order._id, message: updateMessage })
              }
            >
              {isUpdating ? <ClipLoader size={16} /> : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='bg-white rounded-2xl shadow-lg overflow-hidden mb-8'>
        <div className='p-6 flex flex-col sm:flex-row gap-6'>
          <div className='flex-shrink-0'>
            <div className='h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400'>
              {order.items[0].product ? (
                <img
                  src={order.items[0].product.images[0]}
                  alt={order.items[0].product.name}
                />
              ) : (
                <span>IMG</span>
              )}
            </div>
          </div>
          <div className='flex-1'>
            <h2 className='text-2xl font-semibold mb-1'>
              Order ID: {order._id}
            </h2>
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
              <Button
                variant='default'
                onClick={() => navigate(`/orders/${order._id}`)}
                className='flex items-center gap-2'
              >
                <FaInfoCircle /> Details
              </Button>
              {!order.isDelivered && (
                <Button
                  variant='destructive'
                  onClick={() => openCancelModal(order._id)}
                  disabled={order.isCancelled || isCancelling}
                >
                  {isCancelling ? (
                    <ClipLoader size={16} />
                  ) : order.isCancelled ? (
                    'Cancelled'
                  ) : (
                    <>
                      <FaTimes /> Cancel
                    </>
                  )}
                </Button>
              )}
              {!order.isCancelled && (
                <Button
                  variant='default'
                  disabled={order.isDelivered || order.isCancelled}
                  onClick={() => orderDeliveredHandler(order._id)}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                >
                  {order.isDelivered ? (
                    <>
                      <FaCheck /> Delivered
                    </>
                  ) : (
                    <>
                      <FaCheck /> Mark Delivered
                    </>
                  )}
                </Button>
              )}
              <Button
                variant='default'
                onClick={() => openUpdateModal(order._id)}
                disabled={isUpdating}
                className='flex items-center gap-2'
              >
                {isUpdating ? (
                  <ClipLoader size={16} />
                ) : (
                  <>
                    <FaArrowUp /> Add updates
                  </>
                )}
              </Button>
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
    </>
  );
}
