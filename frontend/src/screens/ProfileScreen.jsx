import { AppSidebar } from '@/components/AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React from 'react';

export default function ProfileScreen({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarInset className={'overflow-hidden max-w-full p-2'}>
          <SidebarTrigger className={'block md:hidden'} />
          {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
