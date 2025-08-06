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
import { PlusCircle, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { DentalCase } from '@/types';
import AiSuggester from './ai-suggester';
import ToothSelector from './tooth-selector';
import { Checkbox } from './ui/checkbox';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  dentistName: z.string().min(2, { message: 'Dentist name must be at least 2 characters.' }),
  toothNumbers: z.string().min(1, { message: 'At least one tooth number is required.' }),
  prosthesisType: z.string().min(3, { message: 'Prosthesis type is required.' }),
  material: z.string().min(1, { message: 'At least one material must be selected.' }),
  shade: z.string().min(1, { message: 'Shade is required.' }),
  notes: z.string().optional(),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseEntryFormProps {
  caseToEdit?: Partial<DentalCase>; // Allow partial for template
  onUpdate?: (updatedCase: DentalCase) => void;
  onAddCase?: (newCase: Omit<DentalCase, 'id'>) => void;
}

const materialOptions = ["Zolid", "Zirconia", "Nickel Free", "N-Guard", "Implant", "MookUp"];

export default function CaseEntryForm({ caseToEdit, onUpdate, onAddCase }: CaseEntryFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: caseToEdit || {
      patientName: '',
      dentistName: '',
      toothNumbers: '',
      prosthesisType: '',
      material: '',
      shade: '',
      notes: '',
    },
  });
  
  const isEditMode = !!caseToEdit?.id;

  function onSubmit(values: CaseFormValues) {
    if (isEditMode && onUpdate && caseToEdit.id) {
        onUpdate({ ...values, id: caseToEdit.id });
        toast({
            title: 'Case Updated',
            description: `Case for ${values.patientName} has been successfully updated.`,
        });
    } else if (onAddCase) {
        onAddCase(values);
        // The toast and reset are now handled in the page component.
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <PlusCircle className="w-6 h-6 text-primary" />
          {isEditMode ? 'Edit Case' : 'Add New Case'}
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
                    <Input placeholder="Dr. Smith" {...field} disabled={!!caseToEdit?.dentistName} />
                  </FormControl>
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
                  <div className="grid grid-cols-2 gap-2">
                    {materialOptions.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="material"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.split(', ').includes(item)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value ? field.value.split(', ').filter(v => v) : [];
                                    if (checked) {
                                      field.onChange([...currentValues, item].join(', '));
                                    } else {
                                      field.onChange(
                                        currentValues.filter(
                                          (value) => value !== item
                                        ).join(', ')
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
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
                {isEditMode ? 'Save Changes' : 'Add Case'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
