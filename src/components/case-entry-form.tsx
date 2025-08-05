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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Save } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { DentalCase } from '@/types';
import AiSuggester from './ai-suggester';
import ToothSelector from './tooth-selector';

const formSchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  dentistName: z.string().min(2, { message: 'Dentist name must be at least 2 characters.' }),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  toothNumbers: z.string().min(1, { message: 'At least one tooth number is required.' }),
  prosthesisType: z.string().min(3, { message: 'Prosthesis type is required.' }),
  material: z.string().min(3, { message: 'Material is required.' }),
  shade: z.string().min(1, { message: 'Shade is required.' }),
  notes: z.string().optional(),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseEntryFormProps {
  onAddCase: (newCase: Omit<DentalCase, 'id'>) => void;
  caseToEdit?: DentalCase;
  onUpdate?: () => void;
}

export default function CaseEntryForm({ onAddCase, caseToEdit, onUpdate }: CaseEntryFormProps) {
  const { toast } = useToast();

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: caseToEdit || {
      patientName: '',
      dentistName: '',
      dueDate: undefined,
      toothNumbers: '',
      prosthesisType: '',
      material: '',
      shade: '',
      notes: '',
    },
  });

  function onSubmit(values: CaseFormValues) {
    if (caseToEdit && onUpdate) {
        // This is an update, but the main page handles it.
        // We can call onUpdate if we were handling updates inside a dialog.
    } else {
        onAddCase(values);
        toast({
            title: 'Case Added',
            description: `Case for ${values.patientName} has been successfully added.`,
        });
        form.reset({
            patientName: '',
            dentistName: '',
            dueDate: undefined,
            toothNumbers: '',
            prosthesisType: '',
            material: '',
            shade: '',
            notes: '',
        });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <PlusCircle className="w-6 h-6 text-primary" />
          {caseToEdit ? 'Edit Case' : 'Add New Case'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dentistName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dentist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
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
              name="toothNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tooth Number(s)</FormLabel>
                  <FormControl>
                    <ToothSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prosthesisType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prosthesis Type</FormLabel>
                  <FormControl>
                     <AiSuggester
                        field={field}
                        form={form}
                        fieldName="prosthesisType"
                        placeholder="e.g., Crown, Bridge"
                        fieldDescription="The type of dental prosthesis."
                        contextualInformation="This is for a dental lab case entry form."
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                   <FormControl>
                     <AiSuggester
                        field={field}
                        form={form}
                        fieldName="material"
                        placeholder="e.g., Zirconia, E-Max"
                        fieldDescription="The material used for the prosthesis."
                        contextualInformation="Common dental materials include Zirconia, E-Max, PFM, Gold, Porcelain."
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shade</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A2, B1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / Instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any specific instructions..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                <Save className="mr-2 h-4 w-4" />
                {caseToEdit ? 'Save Changes' : 'Add Case'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
