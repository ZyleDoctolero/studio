
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Room } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import React from 'react';

const roomSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1.'),
  equipment: z.string().min(3, 'Please list at least one piece of equipment.'),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  aiHint: z.string().min(2, 'AI hint must be at least 2 characters long.'),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface EditRoomFormProps {
  room: Room;
  onSubmit: (data: Room) => void;
  onCancel: () => void;
}

export function EditRoomForm({ room, onSubmit, onCancel }: EditRoomFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room.name,
      capacity: room.capacity,
      equipment: room.equipment.join(', '),
      imageUrl: room.imageUrl,
      aiHint: room.aiHint,
    },
  });

  const handleSubmit = (values: RoomFormValues) => {
    setIsLoading(true);
    onSubmit({
        ...room,
        ...values,
        imageUrl: values.imageUrl || 'https://placehold.co/600x400.png',
        equipment: values.equipment.split(',').map(e => e.trim()),
    });
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AV Room 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In-room Equipment</FormLabel>
              <FormControl>
                <Textarea placeholder="List equipment, separated by commas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g., seminar room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}
