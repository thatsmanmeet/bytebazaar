import CheckoutProductCard from '@/components/CheckoutProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';
import { useGetCartItemsQuery } from '@/slices/cartApiSlice';
import { useCreateOrderMutation } from '@/slices/ordersApiSlice';
import {
  useAddUserAddressMutation,
  useGetUserAddressQuery,
} from '@/slices/userApiSlice';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressData, setSelectedAddressData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    house: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    isDefault: '',
  });

  const {
    data: cartResponse,
    isLoading: isCartLoading,
    error: cartError,
  } = useGetCartItemsQuery({}, { refetchOnMountOrArgChange: true });

  const {
    data: AddressResponse,
    isLoading: isAddressLoading,
    error: AddressError,
    refetch,
  } = useGetUserAddressQuery();

  const [createOrderAPI] = useCreateOrderMutation();
  const [addressAddAPI] = useAddUserAddressMutation();

  if (isCartLoading || isAddressLoading) {
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

  if (AddressError) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <p>
          {AddressError?.message ||
            AddressError?.data?.message ||
            AddressError?.error}
        </p>
      </div>
    );
  }

  const addAddressHandler = async () => {
    if (
      !addressData.house ||
      !addressData.city ||
      !addressData.state ||
      !addressData.country ||
      !addressData.zipcode
    ) {
      toast.error('all fields are required');
      return;
    }
    try {
      const res = await addressAddAPI(addressData).unwrap();
      toast.success(res.message);
      refetch();
      setEditFormOpen(false);
      setAddressData({
        house: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
      });
    } catch (error) {
      toast.error(error?.data?.message || error?.message || error?.error);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select an address');
      return;
    }

    if (!paymentMethod) {
      toast.error('Payment method is required');
      return;
    }
    try {
      const res = await createOrderAPI({
        paymentMethod,
        shippingAddress: selectedAddressData,
      }).unwrap();
      toast.success(res.message);
      navigate(`/orders/${res.data[0]._id}`);
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
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
          <h1 className='text-2xl font-bold'>Checkout</h1>
          <div>
            {cartResponse.data.items.map((item) => (
              <CheckoutProductCard
                key={item.product._id}
                product={item.product}
                qty={item.quantity}
              />
            ))}
          </div>
          <div className='bg-gray-100 rounded-md p-4 flex flex-col gap-3'>
            <h3 className='text-xl font-bold'>Cart Summary</h3>
            <div className='flex items-center gap-4'>
              <span className='text-md font-semibold'>Items Price: </span>
              <span className='text-md font-semibold'>
                ₹{cartResponse.data.itemsPrice}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-md font-semibold'>Tax Price: </span>
              <span className='text-md font-semibold'>
                ₹{cartResponse.data.taxPrice} (18% GST)
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-md font-semibold'>Shipping Price: </span>
              <span className='text-md font-semibold'>
                ₹{cartResponse.data.shippingPrice}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-md font-semibold'>Total Price: </span>
              <span className='text-md font-semibold'>
                ₹{cartResponse.data.totalPrice}
              </span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='bg-gray-100 rounded-md p-4 flex flex-col gap-3'>
            <h3 className='text-2xl font-bold'>Checkout</h3>
            <div>
              <h3 className='font-semibold mb-2'>Choose Address</h3>
              <div className='flex flex-col gap-4'>
                {AddressResponse.data.map((address) => (
                  <div
                    key={address._id}
                    onClick={() => {
                      setSelectedAddress(address._id);
                      setSelectedAddressData({ ...address });
                    }}
                    className={`flex flex-col gap-1 bg-white rounded-lg cursor-pointer p-2 ${
                      selectedAddress === address._id
                        ? 'border-2 border-blue-500'
                        : ''
                    }`}
                  >
                    <span className='flex items-center gap-1'>
                      <span>House:</span>
                      <span>{address.house}</span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <span>City:</span>
                      <span>{address.city}</span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <span>State:</span>
                      <span>{address.state}</span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <span>Country:</span>
                      <span>{address.country}</span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <span>Zipcode:</span>
                      <span>{address.zipcode}</span>
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className='mt-5'
                onClick={() => setEditFormOpen((prev) => !prev)}
              >
                Add Address
              </Button>
              {editFormOpen && (
                <div className='flex flex-col gap-3 w-full mt-4'>
                  <h4 className='font-2xl font-bold'>Add New Address</h4>
                  <Input
                    placeholder='house'
                    value={addressData.house}
                    onChange={(e) =>
                      setAddressData((prev) => ({
                        ...prev,
                        house: e.target.value,
                      }))
                    }
                    className='p-4'
                  />
                  <Input
                    placeholder='city'
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className='p-4'
                  />
                  <Input
                    placeholder='state'
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className='p-4'
                  />
                  <Input
                    placeholder='country'
                    value={addressData.country}
                    onChange={(e) =>
                      setAddressData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className='p-4'
                  />
                  <Input
                    placeholder='zipcode'
                    value={addressData.zipcode}
                    onChange={(e) =>
                      setAddressData((prev) => ({
                        ...prev,
                        zipcode: e.target.value,
                      }))
                    }
                    className='p-4'
                  />
                  <Button onClick={() => addAddressHandler()}>Submit</Button>
                </div>
              )}
            </div>
            <div>
              <h3 className='font-semibold mb-2'>Choose Payment Method</h3>
              <RadioGroup
                onValueChange={setPaymentMethod}
                value={paymentMethod}
                className='flex flex-col space-y-2'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='COD' id='COD' />
                  <Label htmlFor='COD'>Cash on Delivery</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='Card' id='Card' disabled />
                  <Label htmlFor='Card'>Card</Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              className='flex items-center gap-2'
              onClick={handleCreateOrder}
            >
              <FaCreditCard />
              Create Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
