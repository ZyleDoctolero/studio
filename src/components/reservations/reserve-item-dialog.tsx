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

const reservationSchema = z.object({
  start: z.date({
    required_error: "A start date is required.",
  }),
  end: z.date({
    required_error: "An end date is required.",
  }),
}).refine((data) => data.end > data.start, {
  message: "End date must be after start date.",
  path: ["end"],
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
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 1))
    }
  });

  const handleConfirm = (values: ReservationFormValues) => {
    if (!user) return;
    setIsLoading(true);
    onConfirm(item.id, user.id, values.start, values.end, itemType);
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
                Select your desired reservation dates.
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
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
                <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
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
                                date < (form.getValues('start') || new Date())
                            }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
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
