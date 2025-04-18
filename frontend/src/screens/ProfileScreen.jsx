import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function ProfileScreen({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=''>
        <SidebarTrigger className={'block md:hidden p-5'} />
        {children}
      </main>
    </SidebarProvider>
  );
}
