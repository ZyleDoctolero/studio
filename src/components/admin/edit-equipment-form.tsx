
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Equipment, EquipmentCategory } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import React from 'react';

const equipmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  category: z.enum(['Projector', 'Camera', 'Microphone', 'Other']),
  totalQuantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
  status: z.enum(['Available', 'Partially Available', 'Unavailable', 'Maintenance']),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  aiHint: z.string().min(2, 'AI hint must be at least 2 characters long.'),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface EditEquipmentFormProps {
  equipment: Equipment;
  onSubmit: (data: Equipment) => void;
  onCancel: () => void;
}

export function EditEquipmentForm({ equipment, onSubmit, onCancel }: EditEquipmentFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: equipment.name,
      category: equipment.category,
      totalQuantity: equipment.totalQuantity,
      status: equipment.status,
      imageUrl: equipment.imageUrl,
      aiHint: equipment.aiHint,
    },
  });

  const handleSubmit = (values: EquipmentFormValues) => {
    setIsLoading(true);
    onSubmit({
        ...equipment,
        ...values,
        imageUrl: values.imageUrl || 'https://placehold.co/600x400.png',
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
              <FormLabel>Equipment Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Canon EOS R5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(['Projector', 'Camera', 'Microphone', 'Other'] as EquipmentCategory[]).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(['Available', 'Partially Available', 'Unavailable', 'Maintenance'] as Equipment['status'][]).map(stat => (
                    <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input placeholder="e.g., dslr camera" {...field} />
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
