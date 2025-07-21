'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import type { NavItem } from '@/components/dashboard/sidebar-nav';
import { LayoutDashboard, Users, SlidersHorizontal, DoorOpen, BarChart3 } from 'lucide-react';

const navItems: NavItem[] = [
  { href: '/admin', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/equipment', label: 'Equipment', icon: SlidersHorizontal },
  { href: '/admin/rooms', label: 'Rooms', icon: DoorOpen },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={navItems} expectedRole="admin">
      {children}
    </DashboardLayout>
  );
}
