
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useData } from '@/hooks/use-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddRoomForm } from '@/components/admin/add-room-form';
import type { Room } from '@/lib/types';

export default function AdminRoomsPage() {
  const { rooms, addRoom } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleAddRoom = (newRoom: Omit<Room, 'id'>) => {
    addRoom(newRoom);
    setIsAddModalOpen(false);
  };
  
  return (
    <div>
      <PageHeader
        title="Room Management"
        description="Manage AV rooms and their associated equipment."
      >
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Room
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                </DialogHeader>
                <AddRoomForm onSubmit={handleAddRoom} onCancel={() => setIsAddModalOpen(false)} />
            </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint={room.aiHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>{room.equipment.join(', ')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Override Schedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
