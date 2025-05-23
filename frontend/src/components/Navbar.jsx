import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { FaCartShopping, FaCircleUser } from 'react-icons/fa6';
import { useLogoutMutation } from '../slices/userApiSlice';
import { removeCredentialsOnLogout } from '../slices/authSlice';
import { Input } from './ui/input';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import logo from '@/assets/icon.webp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const Navbar = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const [searchItem, setSearchItem] = useState('');

  const logoutHandler = async () => {
    try {
      const res = await logoutApi().unwrap();
      dispatch(removeCredentialsOnLogout());
      navigate('/login');
      toast.success(res.message || 'Logout Successful');
    } catch (error) {
      toast.error(
        'Logout Failed.',
        error?.data?.message || error?.error || 'Server Error'
      );
    }
  };

  const linkNavigator = (link) => {
    navigate(link);
  };

  return (
    <div className='w-full p-5 flex items-center justify-between'>
      <div className='flex flex-col text-xl text-black font-semibold'>
        <Link to={'/'}>
          <img src={logo} alt='bytebazaar' className='w-18 h-18' />
        </Link>
      </div>
      <div className='relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl hidden sm:block'>
        <FaSearch className='absolute left-0 top-[0.13rem] m-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Search for products'
          className='bg-slate-100 dark:bg-slate-600 rounded-xl p-5 pl-9'
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchItem !== '') {
              console.log('You entered ' + searchItem);
              navigate(`/search?query=${searchItem}`);
            }
          }}
        />
      </div>
      <div className='mr-3 flex items-center gap-5'>
        <Dialog className='block sm:hidden'>
          <DialogTrigger className='block sm:hidden'>
            <FaSearch size={22} color='#333' />
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search for Product</DialogTitle>
            </DialogHeader>
            <div className='relative w-full mt-5'>
              <FaSearch className='absolute left-0 top-[0.13rem] m-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='text'
                placeholder='What would you like to search for?'
                className='bg-slate-100 dark:bg-slate-600 rounded-xl p-5 pl-9'
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchItem !== '') {
                    console.log('You entered ' + searchItem);
                    navigate(`/search?query=${searchItem}`);
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
        <Link to='/cart'>
          <FaCartShopping size={30} color='#333' />
        </Link>
        {userInfo !== null ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='relative outline-none'>
              <Avatar>
                <AvatarImage
                  src={userInfo.avatar || '/uploads/default.png'}
                  alt='avatar'
                  className={' rounded-full border-green-800 border-2'}
                />
                <AvatarFallback>
                  {userInfo.name.substr(0, 1) || 'A'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => linkNavigator('/profile/account')}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logoutHandler}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to='/login'>
            <FaCircleUser size={30} color='#333' />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
