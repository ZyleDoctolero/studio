'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import type { NavItem } from '@/components/dashboard/sidebar-nav';
import { LayoutDashboard, User, Bell } from 'lucide-react';

const navItems: NavItem[] = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'Profile & History', icon: User },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={navItems} expectedRole="student">
      {children}
    </DashboardLayout>
  );
}
