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

// Menu items.
const items = [
  {
    title: 'Account',
    url: '/profile/account',
    icon: User,
  },
  {
    title: 'Addresses',
    url: '/profile/addresses',
    icon: MapPin,
  },
  {
    title: 'Reviews',
    url: '/profile/reviews',
    icon: MessageSquare,
  },
  {
    title: 'Orders',
    url: '/profile/orders',
    icon: BoxIcon,
  },
  {
    title: 'Seller',
    url: '/profile/seller/dashboard',
    icon: DollarSign,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className={'mb-5 text-xl cursor-pointer'}
            onClick={() => navigate('/')}
          >
            ByteBazaar
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`p-5 aria-[current=page]:bg-blue-100`}
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
