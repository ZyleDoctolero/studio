
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import type { Room, Reservation } from '@/lib/types';
import { useData } from '@/hooks/use-data';
import { format } from 'date-fns';

interface RoomCalendarDialogProps {
  room: Room;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomCalendarDialog({ room, isOpen, onOpenChange }: RoomCalendarDialogProps) {
  const { reservations, users } = useData();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Filter reservations for this specific room
  const roomReservations = reservations.filter(
    (r) => r.itemId === room.id && r.itemType === 'room' && ['Active', 'Pending'].includes(r.status)
  );

  // Get all dates that have reservations
  const reservedDays = roomReservations.reduce((acc, res) => {
    let day = new Date(res.start);
    day.setHours(0,0,0,0);
    while (day <= res.end) {
      acc.add(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    return acc;
  }, new Set<Date>());
  
  const modifiers = {
    reserved: Array.from(reservedDays),
  };

  const modifiersStyles = {
    reserved: {
      color: 'hsl(var(--destructive-foreground))',
      backgroundColor: 'hsl(var(--destructive))',
    },
  };
  
  // Get reservations for the selected day
  const reservationsForSelectedDay = roomReservations.filter(res => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    selected.setHours(0,0,0,0);
    const start = new Date(res.start);
    start.setHours(0,0,0,0);
    const end = new Date(res.end);
    end.setHours(0,0,0,0);
    return selected >= start && selected <= end;
  });

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown User';

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Availability for {room.name}</DialogTitle>
          <DialogDescription>
            View the existing schedule for this room. Days marked in red are booked.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    className="rounded-md border"
                />
            </div>
            <div>
                <h4 className="font-semibold mb-2">
                    Schedule for {selectedDate ? format(selectedDate, 'PPP') : '...'}
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {reservationsForSelectedDay.length > 0 ? (
                        reservationsForSelectedDay.map(res => (
                            <div key={res.id} className="p-2 border rounded-md bg-muted/50">
                                <p className="font-medium text-sm">
                                    {format(res.start, 'h:mm a')} - {format(res.end, 'h:mm a')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Booked by: {getUserName(res.userId)}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    Status: <Badge variant={res.status === 'Active' ? 'default' : 'secondary'} className='h-auto py-0 px-1.5 text-[10px]'>{res.status}</Badge>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground mt-4 text-center">No reservations for this day.</p>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
