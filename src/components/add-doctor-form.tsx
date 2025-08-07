
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AddDoctorFormValues = z.infer<typeof formSchema>;

interface AddDoctorFormProps {
  onAddDoctor: (values: AddDoctorFormValues) => void;
}

export default function AddDoctorForm({ onAddDoctor }: AddDoctorFormProps) {
  const form = useForm<AddDoctorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  function onSubmit(values: AddDoctorFormValues) {
    onAddDoctor(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Add Doctor
        </Button>
      </form>
    </Form>
  );
}
