
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { User, Reservation } from '@/lib/types';
import { useData } from '@/hooks/use-data';
import { format } from 'date-fns';

interface UserActivityDialogProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserActivityDialog({ user, isOpen, onOpenChange }: UserActivityDialogProps) {
  const { reservations, equipment, rooms } = useData();

  const userReservations = reservations
    .filter(r => r.userId === user.id)
    .sort((a, b) => b.start.getTime() - a.start.getTime());

  const getItemName = (reservation: Reservation) => {
    const source = reservation.itemType === 'equipment' ? equipment : rooms;
    return source.find(item => item.id === reservation.itemId)?.name || 'Unknown Item';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Completed':
        return 'outline';
      case 'Declined':
      case 'Overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Activity for {user.name}</DialogTitle>
          <DialogDescription>
            A complete log of all reservations made by this user.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userReservations.length > 0 ? (
                userReservations.map(res => (
                  <TableRow key={res.id}>
                    <TableCell>{getItemName(res)}</TableCell>
                    <TableCell className='capitalize'>{res.itemType}</TableCell>
                    <TableCell>{format(res.start, 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(res.end, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(res.status)}>
                        {res.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    This user has no reservation history.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
