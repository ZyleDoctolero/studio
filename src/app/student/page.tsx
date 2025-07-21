
'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import type { EquipmentCategory } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from '@/hooks/use-data';

export default function StudentDashboardPage() {
  const [filter, setFilter] = useState<EquipmentCategory | 'all'>('all');
  const { equipment, reservations } = useData();

  const getAvailableCount = (equipmentId: string) => {
    const reservedCount = reservations.filter(r => r.itemId === equipmentId && r.status === 'Active' && r.itemType === 'equipment').length;
    const totalCount = equipment.find(e => e.id === equipmentId)?.totalQuantity || 0;
    return totalCount - reservedCount;
  };
  
  const filteredEquipment = filter === 'all' 
    ? equipment 
    : equipment.filter((item) => item.category === filter);

  const categories = [...new Set(equipment.map(item => item.category))];

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Equipment Reservation"
        description="Browse and reserve available AV equipment for your projects and classes."
      >
        <Select value={filter} onValueChange={(value) => setFilter(value as EquipmentCategory | 'all')}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </PageHeader>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEquipment.map((item) => {
            const availableCount = getAvailableCount(item.id);
            const isAvailable = availableCount > 0;
            return (
                <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                        <div className="aspect-video overflow-hidden rounded-md mb-4">
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                            data-ai-hint={item.aiHint}
                        />
                        </div>
                        <CardTitle className='font-headline tracking-normal'>{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Availability</span>
                                <span>{availableCount} / {item.totalQuantity}</span>
                            </div>
                            <Progress value={(availableCount / item.totalQuantity) * 100} />
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={!isAvailable}>
                            {isAvailable ? 'Reserve' : 'Unavailable'}
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
