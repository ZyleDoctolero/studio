
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
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useData } from '@/hooks/use-data';
import { AddEquipmentForm } from '@/components/admin/add-equipment-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Equipment } from '@/lib/types';

export default function AdminEquipmentPage() {
  const { equipment, addEquipment } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const handleAddEquipment = (newEquipment: Omit<Equipment, 'id' | 'status'>) => {
    addEquipment(newEquipment);
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Equipment Management"
        description="Add, edit, and manage all AV equipment in the system."
      >
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Equipment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                <AddEquipmentForm onSubmit={handleAddEquipment} onCancel={() => setIsAddModalOpen(false)} />
            </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint={item.aiHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.totalQuantity}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === 'Available' ? 'secondary' : item.status === 'Unavailable' ? 'destructive' : 'default'
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
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
                      <DropdownMenuItem>Set Maintenance</DropdownMenuItem>
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
