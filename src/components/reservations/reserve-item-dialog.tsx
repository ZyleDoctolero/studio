
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Equipment, Room } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '../ui/input';

const reservationSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM."),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM."),
}).refine((data) => {
    const start = new Date(data.date);
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    start.setHours(startHours, startMinutes);

    const end = new Date(data.date);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    end.setHours(endHours, endMinutes);

    return end > start;
}, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReserveItemDialogProps {
  item: Equipment | Room;
  itemType: 'equipment' | 'room';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (itemId: string, userId: string, start: Date, end: Date, itemType: 'equipment' | 'room') => void;
}

export function ReserveItemDialog({ item, itemType, isOpen, onOpenChange, onConfirm }: ReserveItemDialogProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
        date: new Date(),
        startTime: format(new Date(), 'HH:mm'),
        endTime: format(new Date(new Date().setHours(new Date().getHours() + 1)), 'HH:mm'),
    }
  });

  const handleConfirm = (values: ReservationFormValues) => {
    if (!user) return;
    setIsLoading(true);
    
    const [startHours, startMinutes] = values.startTime.split(':').map(Number);
    const startDate = new Date(values.date);
    startDate.setHours(startHours, startMinutes);

    const [endHours, endMinutes] = values.endTime.split(':').map(Number);
    const endDate = new Date(values.date);
    endDate.setHours(endHours, endMinutes);

    onConfirm(item.id, user.id, startDate, endDate, itemType);
    setIsLoading(false);
    onOpenChange(false);
    form.reset();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Reserve: {item.name}</DialogTitle>
            <DialogDescription>
                Select your desired reservation date and time.
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP")
                                ) : (
                                <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Reservation
                </Button>
                </div>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
