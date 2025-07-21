
'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/hooks/use-data';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminReservationsPage() {
  const { reservations, users, equipment, rooms, approveReservation, declineReservation } = useData();

  const getItemName = (itemId: string, itemType: 'equipment' | 'room') => {
    const source = itemType === 'equipment' ? equipment : rooms;
    return source.find(item => item.id === itemId)?.name || 'Unknown Item';
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
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

  const renderReservationRows = (filterStatus: string) => {
    const filteredReservations = reservations
        .filter(r => r.status === filterStatus)
        .sort((a,b) => a.start.getTime() - b.start.getTime());

    if (filteredReservations.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                    No {filterStatus.toLowerCase()} reservations.
                </TableCell>
            </TableRow>
        )
    }

    return filteredReservations.map(res => (
        <TableRow key={res.id}>
          <TableCell className="font-medium">{getItemName(res.itemId, res.itemType)}</TableCell>
          <TableCell>{getUserName(res.userId)}</TableCell>
          <TableCell>{format(res.start, 'MMM d, yyyy h:mm a')}</TableCell>
          <TableCell>{format(res.end, 'MMM d, yyyy h:mm a')}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(res.status)}>{res.status}</Badge>
          </TableCell>
          <TableCell>
            {res.status === 'Pending' && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className='h-8 w-8 text-green-600 hover:text-green-600' onClick={() => approveReservation(res.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className='h-8 w-8 text-red-600 hover:text-red-600' onClick={() => declineReservation(res.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TableCell>
        </TableRow>
      )
    )
  }

  return (
    <div>
      <PageHeader
        title="Reservation Management"
        description="Approve, decline, and manage all user reservations for equipment and rooms."
      />
      <Tabs defaultValue="pending">
        <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='w-[100px]'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TabsContent value="pending" className='contents'>
                        {renderReservationRows('Pending')}
                    </TabsContent>
                    <TabsContent value="active" className='contents'>
                        {renderReservationRows('Active')}
                    </TabsContent>
                    <TabsContent value="completed" className='contents'>
                        {renderReservationRows('Completed')}
                    </TabsContent>
                    <TabsContent value="declined" className='contents'>
                        {renderReservationRows('Declined')}
                    </TabsContent>
                     <TabsContent value="overdue" className='contents'>
                        {renderReservationRows('Overdue')}
                    </TabsContent>
                </TableBody>
            </Table>
        </div>
      </Tabs>
    </div>
  );
}
