
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import React from 'react';

const penaltySchema = z.object({
  penaltyPoints: z.coerce.number().int().min(0, 'Penalty points cannot be negative.'),
});

type PenaltyFormValues = z.infer<typeof penaltySchema>;

interface AdjustPenaltyFormProps {
  user: User;
  onSubmit: (userId: string, penaltyPoints: number) => void;
  onCancel: () => void;
}

export function AdjustPenaltyForm({ user, onSubmit, onCancel }: AdjustPenaltyFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<PenaltyFormValues>({
    resolver: zodResolver(penaltySchema),
    defaultValues: {
      penaltyPoints: user.penaltyPoints,
    },
  });

  const handleSubmit = (values: PenaltyFormValues) => {
    setIsLoading(true);
    onSubmit(user.id, values.penaltyPoints);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="penaltyPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Penalty Point Total</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
                Update Points
            </Button>
        </div>
      </form>
    </Form>
  );
}
