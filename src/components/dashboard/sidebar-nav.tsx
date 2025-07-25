
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            className={cn(
              'group-data-[collapsible=icon]:justify-center',
            )}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
