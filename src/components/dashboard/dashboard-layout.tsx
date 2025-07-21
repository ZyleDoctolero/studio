'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/dashboard/user-nav';
import { SidebarNav, NavItem } from '@/components/dashboard/sidebar-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import type { Role } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  expectedRole: Role;
}

export default function DashboardLayout({
  children,
  navItems,
  expectedRole,
}: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== expectedRole) {
        // Log out or redirect to their own dashboard if wrong role
        logout();
        router.replace('/login');
      }
    }
  }, [user, loading, router, expectedRole, logout]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-lg font-semibold tracking-tighter">UIC Hub</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <UserNav user={user} logout={logout} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 md:px-6">
            <div className='md:hidden'>
                <SidebarTrigger />
            </div>
            <div className='flex-1'>
                <h1 className="font-headline text-xl font-semibold tracking-tight capitalize">
                    {expectedRole} Dashboard
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
