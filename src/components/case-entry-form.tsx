
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
import { PlusCircle, Save, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { DentalCase } from '@/types';
import ToothSelector from './tooth-selector';
import { Checkbox } from './ui/checkbox';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useRef } from 'react';

const formSchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  dentistName: z.string().min(2, { message: 'Dentist name must be at least 2 characters.' }),
  toothNumbers: z.string().min(1, { message: 'At least one tooth number is required.' }),
  prosthesisType: z.string().min(1, { message: 'At least one prosthesis type must be selected.' }),
  material: z.string().min(1, { message: 'At least one material must be selected.' }),
  shade: z.string().min(1, { message: 'Shade is required.' }),
  notes: z.string().optional(),
  photoDataUri: z.string().optional(),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseEntryFormProps {
  caseToEdit?: Partial<DentalCase>; // Allow partial for template
  onUpdate?: (updatedCase: DentalCase) => void;
  onAddCase?: (newCase: Omit<DentalCase, 'id' | 'createdAt'>) => void;
}

const materialOptions = ["Zolid", "Zirconia", "Nickel Free", "N-Guard", "Implant", "MookUp"];
const prosthesisTypeOptions = ["Separate", "Bridge"];

export default function CaseEntryForm({ caseToEdit, onUpdate, onAddCase }: CaseEntryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: caseToEdit?.patientName || '',
      dentistName: caseToEdit?.dentistName || '',
      toothNumbers: caseToEdit?.toothNumbers || '',
      prosthesisType: caseToEdit?.prosthesisType || '',
      material: caseToEdit?.material || '',
      shade: caseToEdit?.shade || '',
      notes: caseToEdit?.notes || '',
      photoDataUri: caseToEdit?.photoDataUri || '',
    },
  });
  
  const isEditMode = !!caseToEdit?.id;

  function onSubmit(values: CaseFormValues) {
    if (isEditMode && onUpdate && caseToEdit.id && caseToEdit.createdAt) {
        onUpdate({ ...values, id: caseToEdit.id, createdAt: caseToEdit.createdAt });
        toast({
            title: 'Case Updated',
            description: `Case for ${values.patientName} has been successfully updated.`,
        });
    } else if (onAddCase) {
        onAddCase(values);
        // The toast and reset are now handled in the page component.
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit for safety
        toast({
          variant: 'destructive',
          title: 'Image Too Large',
          description: 'The selected image is over 1MB. Please resize it or choose a smaller file to avoid database errors.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('photoDataUri', reader.result as string, { shouldValidate: true });
      };
      reader.onerror = () => {
         toast({
          variant: 'destructive',
          title: 'Error Reading File',
          description: 'There was a problem reading the selected file.',
        });
      }
      reader.readAsDataURL(file);
    }
  };

  const photoDataUri = form.watch('photoDataUri');

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
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Patient Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel className="font-bold">Dentist Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!!caseToEdit?.dentistName} />
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
                          <FormLabel className="font-bold">Tooth Number(s)</FormLabel>
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
                          <FormLabel className="font-bold">Prosthesis Type</FormLabel>
                           <div className="grid grid-cols-2 gap-2">
                            {prosthesisTypeOptions.map((item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="prosthesisType"
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
                      name="material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Material</FormLabel>
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
                          <FormLabel className="font-bold">Shade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Notes / Instructions</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Add any specific instructions..." {...field} className="min-h-[100px]"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="photoDataUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Photo</FormLabel>
                            <FormControl>
                                <div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      ref={fileInputRef}
                                      onChange={handleFileChange}
                                      className="hidden"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => fileInputRef.current?.click()}
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      {photoDataUri ? 'Change Photo' : 'Upload Photo'}
                                    </Button>
                                </div>
                            </FormControl>
                            {photoDataUri && (
                                <div className="relative mt-2 w-full max-w-xs aspect-square rounded-md border p-1">
                                    <Image
                                      src={photoDataUri}
                                      alt="Photo preview"
                                      fill
                                      className="object-contain rounded-md"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                      onClick={() => form.setValue('photoDataUri', '')}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </div>
            
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 mt-6">
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Save Changes' : 'Add Case'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    