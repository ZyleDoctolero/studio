
'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MonitorSpeaker } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/hooks/use-data';

export default function RoomBookingPage() {
    const { rooms, reservations } = useData();

    const isRoomAvailable = (roomId: string) => {
        const now = new Date();
        const activeReservations = reservations.filter(r => 
            r.itemId === roomId && 
            r.itemType === 'room' &&
            r.status === 'Active' &&
            now >= r.start && now < r.end
        );
        return activeReservations.length === 0;
    };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Room Booking"
        description="Reserve AV rooms and lecture halls for your classes and events."
      />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => {
          const available = isRoomAvailable(room.id);
          return (
            <Card key={room.id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-video overflow-hidden rounded-md mb-4">
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={room.aiHint}
                  />
                </div>
                <CardTitle className='font-headline tracking-normal'>{room.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Capacity: {room.capacity}</span>
                </div>
                <div className="flex items-start text-muted-foreground">
                  <MonitorSpeaker className="mr-2 h-4 w-4 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">In-room Equipment:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {room.equipment.map(eq => (
                        <Badge key={eq} variant="secondary">{eq}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2">
                <Button disabled={!available}>
                  {available ? 'Book Now' : 'Currently Booked'}
                </Button>
                <Button variant="outline">View Calendar</Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
