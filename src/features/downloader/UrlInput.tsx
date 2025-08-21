'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export const urlInputSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  consent: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'You must agree to the terms to proceed.' }),
  }),
});

export function UrlInput() {
  const { control } = useFormContext<z.infer<typeof urlInputSchema>>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="url">Video URL</FormLabel>
            <FormControl>
              <Input id="url" placeholder="https://www.youtube.com/watch?v=..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="consent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm that I own the rights or have explicit permission from the rights holder to download this content.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
