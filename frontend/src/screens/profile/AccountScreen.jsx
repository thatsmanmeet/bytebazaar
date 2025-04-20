import React, { useState } from 'react';
import ProfileScreen from '../ProfileScreen';
import {
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useUpdateUserProfileMutation,
  useVerifyTwoFactorMutation,
} from '@/slices/userApiSlice';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  removeCredentialsOnLogout,
  setCredentialsOnLogin,
} from '@/slices/authSlice';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function AccountScreen() {
  const { userInfo } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateUserProfileAPI] = useUpdateUserProfileMutation();
  const [enableTwoFactorAPI] = useEnableTwoFactorMutation();
  const [verifyTwoFactorAPI] = useVerifyTwoFactorMutation();
  const [disableTwoFactorAPI] = useDisableTwoFactorMutation();
  const [profileData, setProfileData] = useState({
    name: userInfo.name,
    email: userInfo.email,
    password: '',
    confirmPassword: '',
  });
  const [qrCodeData, setQrCodeData] = useState('');
  const [secretToken, setSecretToken] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  const profileUpdateHandler = async () => {
    if (
      !profileData.name &&
      !profileData.email &&
      !profileData.password &&
      !profileData.confirmPassword
    ) {
      return;
    }

    if (
      profileData.password &&
      profileData.password !== profileData.confirmPassword
    ) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const accessToken = userInfo.accessToken;
      const refreshToken = userInfo.refreshToken;
      const res = await updateUserProfileAPI(profileData).unwrap();
      dispatch(
        setCredentialsOnLogin({ ...res.data, accessToken, refreshToken })
      );
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const enableTwoFactorHandler = async () => {
    try {
      const res = await enableTwoFactorAPI().unwrap();
      toast.success(res.message);
      setQrCodeData(res.data.qrCodeData);
      setSecretToken(res.data.secret);
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const disableTwoFactorHandler = async () => {
    if (!password) {
      toast.error('Password is required');
    }
    try {
      const res = await disableTwoFactorAPI({ password }).unwrap();
      toast.success(res.message + ' ' + 'Login again');
      setPassword('');
      dispatch(removeCredentialsOnLogout());
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const verifyTwoFactorHandler = async () => {
    if (!token) {
      toast.error('OTP code is required');
      return;
    }
    try {
      const res = await verifyTwoFactorAPI({ token }).unwrap();
      setQrCodeData('');
      setSecretToken('');
      dispatch(removeCredentialsOnLogout());
      toast.success(res.message);
      navigate('/login');
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  return (
    <ProfileScreen>
      <div className='max-w-full p-5'>
        <div className='flex flex-col gap-3'>
          <h1 className='text-2xl font-bold'>Account</h1>
          <p>You can update your account information here</p>
          <div className='flex flex-col gap-3 w-full md:w-[60vw]'>
            <Input
              placeholder='Your Name'
              type='text'
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              placeholder='Your Email Address'
              type='email'
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <Input
              placeholder='Password'
              type='password'
              value={profileData.password}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <Input
              placeholder='Confirm Password'
              type='password'
              value={profileData.confirmPassword}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
            <Button onClick={profileUpdateHandler}>Update</Button>
          </div>
        </div>
        <div className='flex flex-col gap-3 mt-5'>
          <h2 className='text-2xl font-bold'>Two Factor Authentication</h2>
          <p>Enable/Disable 2FA system here</p>
          {!userInfo.twoFactorEnabled ? (
            <Button onClick={enableTwoFactorHandler}>
              Enable Two Factor Auth
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='destructive' className='text-white'>
                  Disable Two Factor Auth
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Disable 2FA</DialogTitle>
                  <DialogDescription>
                    Enter your password to disable 2FA login
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <Input
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={disableTwoFactorHandler}
                    variant='destructive'
                    className='text-white'
                  >
                    Disable 2FA
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {qrCodeData && (
            <div className='flex flex-col gap-3'>
              <p>Scan the QR code below with authenticator</p>
              <QRCode value={qrCodeData} />
              <p>
                You can use this code if you cannot scan the QR code:{' '}
                {secretToken}
              </p>
              <Input
                type='number'
                placeholder='OTP CODE'
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <Button onClick={verifyTwoFactorHandler}>Verify</Button>
            </div>
          )}
        </div>
      </div>
    </ProfileScreen>
  );
}

export default AccountScreen;
