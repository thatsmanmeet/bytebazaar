import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { FaCartShopping, FaCrown, FaMoon, FaSun } from 'react-icons/fa6';
import { useLogoutMutation } from '@/slices/userApiSlice';
import { removeCredentialsOnLogout } from '@/slices/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

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
      <div className='flex flex-col text-xl text-slate-600 font-semibold'>
        <span>ByteBazaar</span>
      </div>
      <div className='mr-3 flex items-center gap-3'>
        <Link to='/cart'>
          <FaCartShopping size={24} color='#333' />
        </Link>
        {userInfo !== null ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='relative outline-none'>
              <Avatar>
                <AvatarImage
                  src={userInfo.avatar || '/uploads/default.png'}
                  alt='avatar'
                />
                <AvatarFallback>
                  {userInfo.name.substr(0, 1) || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => linkNavigator('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logoutHandler}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to='/login'>
            <Button className='text-black'>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
