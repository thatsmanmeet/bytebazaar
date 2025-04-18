import React, { useState } from 'react';
import ProfileScreen from '../ProfileScreen';
import {
  useAddUserAddressMutation,
  useDeleteUserAddressMutation,
  useGetUserAddressQuery,
  useUpdateUserAddressMutation,
} from '@/slices/userApiSlice';
import { ClipLoader } from 'react-spinners';
import { AddressCard } from '@/components/AddressCard';
import toast from 'react-hot-toast';
import AddAddressCard from '@/components/AddAddressCard';
import { Button } from '@/components/ui/button';

function AddressScreen() {
  const [addForm, setAddForm] = useState(false);
  const {
    data: addressResponse,
    isLoading,
    error,
    refetch,
  } = useGetUserAddressQuery();

  const [addressUpdateAPI] = useUpdateUserAddressMutation();
  const [addressAddAPI] = useAddUserAddressMutation();
  const [addressDeleteAPI] = useDeleteUserAddressMutation();

  const addressUpdateHandler = async (data) => {
    if (!data) {
      toast.error('Address Data not found');
      return;
    }
    try {
      const res = await addressUpdateAPI(data).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.message || error?.error);
    }
  };

  const addressAddHandler = async (data) => {
    if (!data) {
      toast.error('Address Data not found');
      return;
    }
    try {
      const res = await addressAddAPI(data).unwrap();
      toast.success(res.message);
      refetch();
      setAddForm(false);
    } catch (error) {
      toast.error(error?.data?.message || error?.message || error?.error);
    }
  };

  const addressDeletionHandler = async (data) => {
    if (!data) {
      toast.error('Address ID not found');
      return;
    }
    try {
      const res = await addressDeleteAPI(data).unwrap();
      toast.success(res.message);
      refetch();
      setAddForm(false);
    } catch (error) {
      toast.error(error?.data?.message || error?.message || error?.error);
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

  //   console.log(addressResponse.data);

  return (
    <ProfileScreen>
      <div className='w-full sm:min-w-xl p-5 flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Your Addresses</h1>
          <Button
            className='cursor-pointer'
            onClick={() => setAddForm((prev) => !prev)}
          >
            Add Address
          </Button>
        </div>
        {addForm && (
          <div>
            <AddAddressCard
              addDataHandler={(data) => addressAddHandler(data)}
            />
          </div>
        )}
        <div>
          {addressResponse.data.map((address) => (
            <AddressCard
              key={`${address._id}-${address.house}`}
              address={address}
              onEdit={(data) => addressUpdateHandler(data)}
              onDelete={(data) => addressDeletionHandler(data)}
            />
          ))}
        </div>
      </div>
    </ProfileScreen>
  );
}

export default AddressScreen;
