import { User, MessageSquare, DollarSign, BoxIcon, MapPin } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

// Main menu items.
const mainItems = [
  { title: 'Account', url: '/profile/account', icon: User },
  { title: 'Addresses', url: '/profile/addresses', icon: MapPin },
  { title: 'Reviews', url: '/profile/reviews', icon: MessageSquare },
  { title: 'Orders', url: '/profile/orders', icon: BoxIcon },
  {
    title: 'Seller Panel',
    url: '/profile/seller/dashboard',
    icon: DollarSign,
    isGroupLabel: true,
  },
];

// Seller submenu items.
const sellerItems = [
  { title: 'Dashboard', url: '/profile/seller/dashboard', icon: DollarSign },
  { title: 'Products', url: '/profile/seller/products', icon: BoxIcon },
  { title: 'Orders', url: '/profile/seller/orders', icon: BoxIcon },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((store) => store.auth);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className='mb-5 text-xl cursor-pointer'
            onClick={() => navigate('/')}
          >
            ByteBazaar
          </SidebarGroupLabel>

          <SidebarGroupContent>
            {/* Main navigation items */}
            <SidebarMenu>
              {mainItems.map((item) =>
                item.isGroupLabel ? (
                  <SidebarGroupLabel
                    key={item.title}
                    className='mt-6 mb-2 text-lg'
                  >
                    {item.title}
                  </SidebarGroupLabel>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`p-5 aria-[current=page]:bg-blue-100 flex items-center gap-2`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>

            {/* Seller submenu items */}
            <SidebarMenu className='mt-2'>
              {sellerItems
                .filter(
                  (item) =>
                    userInfo?.role === 'seller' || item.title === 'Dashboard'
                )
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`p-5 aria-[current=page]:bg-blue-100 flex items-center gap-2`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
