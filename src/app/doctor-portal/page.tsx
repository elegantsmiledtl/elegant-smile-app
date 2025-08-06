'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DentalCase } from '@/types';
import CaseEntryForm from '@/components/case-entry-form';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { addCase } from '@/lib/firebase';

export default function DoctorPortalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [doctorName, setDoctorName] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedUser = localStorage.getItem('loggedInUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setDoctorName(user.name);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
  }, [router]);

  const handleAddCase = async (newCase: Omit<DentalCase, 'id'>) => {
    if (!isMounted) return;
    try {
      const caseWithSource: Omit<DentalCase, 'id'> = { 
          ...newCase, 
          source: 'Desktop' // Assuming doctor portal is on desktop
      };
      await addCase(caseWithSource);
      
      toast({
        title: 'Case Added',
        description: `Case for ${newCase.patientName} has been successfully added.`,
      });
      
      // Reset the form by changing the key
      setFormKey(Date.now());

    } catch (error) {
       console.error("Failed to save case to Firestore", error);
       toast({
        variant: "destructive",
        title: "Failed to add case",
        description: "There was an error saving the case.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  if (!isMounted || !doctorName) {
    return null; 
  }

  // Create a template case with the doctor's name pre-filled
  const caseTemplate: Partial<DentalCase> = {
    dentistName: doctorName,
    patientName: '',
    dueDate: undefined,
    toothNumbers: '',
    prosthesisType: '',
    material: '',
    shade: '',
    notes: '',
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card border-b shadow-sm p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Logo />
                <div className="flex items-center gap-4">
                     <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Stethoscope className="w-6 h-6" />
                        Welcome, {doctorName}
                    </h2>
                    <Button onClick={handleLogout} variant="outline">
                        <LogOut className="mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-2xl">
            <CaseEntryForm 
              key={formKey}
              onAddCase={handleAddCase}
              caseToEdit={caseTemplate as DentalCase} // Pass the template
            />
        </div>
      </main>
    </div>
  );
}
