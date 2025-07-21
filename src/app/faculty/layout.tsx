'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import type { NavItem } from '@/components/dashboard/sidebar-nav';
import { LayoutDashboard, DoorOpen, User, Bell } from 'lucide-react';

const navItems: NavItem[] = [
  { href: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/faculty/rooms', label: 'Room Booking', icon: DoorOpen },
  { href: '/faculty/profile', label: 'Profile & History', icon: User },
];

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={navItems} expectedRole="faculty">
      {children}
    </DashboardLayout>
  );
}
