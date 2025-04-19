import React, { useState } from 'react';
import ProfileScreen from '../ProfileScreen';
import { useDispatch, useSelector } from 'react-redux';
import BecomeSellerForm from '@/components/BecomeSellerForm';
import {
  useBecomeSellerMutation,
  useUpdateSellerInfoMutation,
} from '@/slices/userApiSlice';
import toast from 'react-hot-toast';
import {
  removeCredentialsOnLogout,
  setCredentialsOnLogin,
} from '@/slices/authSlice';
import { Link, useNavigate } from 'react-router';
import UpdateSellerForm from '@/components/UpdateSellerForm';
import { FaBox, FaList } from 'react-icons/fa6';

function SellerScreen() {
  const { userInfo } = useSelector((store) => store.auth);
  const [isSellerFormOpen, setIsSellerFormOpen] = useState(false);
  const [updateSellerFormOpen, setUpdateSellerFormOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [becomeSellerAPI] = useBecomeSellerMutation();
  const [updateSellerAPI] = useUpdateSellerInfoMutation();

  const becomeSellerHandler = async (data) => {
    if (!data) {
      toast.error('Data is required');
      return;
    }
    try {
      const res = await becomeSellerAPI(data).unwrap();
      dispatch(removeCredentialsOnLogout());
      navigate('/login');
      toast.success(`${res.message}. Login again`);
    } catch (error) {
      toast.error(error.message || error.data.message || error.error);
    }
  };

  const updateSellerHandler = async (data) => {
    if (!data) {
      toast.error('Data is required');
      return;
    }
    try {
      const res = await updateSellerAPI(data).unwrap();
      const accessToken = userInfo.accessToken;
      dispatch(setCredentialsOnLogin({ ...res.data, accessToken }));
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message || error.data.message || error.error);
    }
  };

  if (userInfo.role !== 'seller') {
    return (
      <ProfileScreen>
        <div className='p-5 flex flex-col gap-3'>
          <h1 className='text-2xl font-bold'>Seller Dashboard</h1>
          <p className='text-xl text-red-500'>
            You are not a seller. You can become a seller and start selling on
            this platform by filling the form below
          </p>
          <p
            onClick={() => setIsSellerFormOpen(true)}
            className='text-lg text-blue-600 cursor-pointer'
          >
            Become a seller
          </p>
          <div>
            {isSellerFormOpen && (
              <BecomeSellerForm
                becomeSellerHandler={(data) => becomeSellerHandler(data)}
              />
            )}
          </div>
        </div>
      </ProfileScreen>
    );
  }
  return (
    <ProfileScreen>
      <div className='p-5 flex flex-col gap-3'>
        <h1 className='text-2xl font-bold'>Seller Dashboard</h1>
        <p className='text-xl text-green-600'>
          You are now a seller. You can start selling your products on our
          platform.
        </p>
        <div className='flex flex-col gap-2 my-3'>
          <Link
            className='flex items-center gap-2'
            to={'/profile/seller/products'}
          >
            <FaList size={18} className='text-green-700' />
            <span className='text-blue-600 font-semibold'>
              Manage your products
            </span>
          </Link>
          <Link
            className='flex items-center gap-2'
            to={'/profile/seller/orders'}
          >
            <FaBox size={18} className='text-amber-700' />
            <span className='text-blue-600 font-semibold'>
              Manage your orders
            </span>
          </Link>
        </div>
        <div className='p-5 flex flex-col gap-3 bg-gray-100 rounded-lg my-3'>
          <h3 className='text-xl font-semibold'>Your Seller Information</h3>
          <div className='flex items-center gap-3'>
            <span>Business Name:</span>
            <span>{userInfo.sellerInfo.businessName}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span>Business Description:</span>
            <span>{userInfo.sellerInfo.description}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span>Business Email:</span>
            <span>{userInfo.sellerInfo.email}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span>Business Contact:</span>
            <span>{userInfo.sellerInfo.phone}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span>Business Website:</span>
            <span>{userInfo.sellerInfo.website || 'N/A'}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span>Business Location:</span>
            <span>{userInfo.sellerInfo.location}</span>
          </div>
          <p
            onClick={() => setUpdateSellerFormOpen((prev) => !prev)}
            className='text-lg text-blue-600 cursor-pointer'
          >
            Update your seller information
          </p>

          <div>
            {updateSellerFormOpen && (
              <UpdateSellerForm
                updateSellerHandler={(data) => updateSellerHandler(data)}
              />
            )}
          </div>
        </div>
      </div>
    </ProfileScreen>
  );
}

export default SellerScreen;
