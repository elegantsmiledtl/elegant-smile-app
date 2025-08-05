'use client';

import { useRouter } from 'next/navigation';
import CaseEntryForm from '@/components/case-entry-form';
import type { DentalCase } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(Date.now()); // Add key state to re-mount the form

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddCase = (newCase: Omit<DentalCase, 'id'>) => {
    if (!isMounted) return;
    try {
      const savedCases = localStorage.getItem('dentalCases');
      const cases: DentalCase[] = savedCases ? JSON.parse(savedCases) : [];
      const newCaseWithId = { ...newCase, id: crypto.randomUUID() };
      const updatedCases = [...cases, newCaseWithId];
      localStorage.setItem('dentalCases', JSON.stringify(updatedCases));
      
      toast({
        title: 'GOT IT',
        description: `Case for ${newCase.patientName} has been successfully added.`,
      });

      // Reset the form by changing the key, which forces a re-render
      setKey(Date.now());

    } catch (error) {
       console.error("Failed to save case to local storage", error);
       toast({
        variant: "destructive",
        title: "Failed to add case",
        description: "There was an error saving the case.",
      });
    }
  };

  const handleUpdate = () => {
    // This page is only for adding, so we redirect home if an update is triggered.
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b shadow-sm p-4">
        <div className="container mx-auto flex justify-center items-center">
          <Logo />
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-lg">
            <CaseEntryForm key={key} onAddCase={handleAddCase} onUpdate={handleUpdate} />
        </div>
      </main>
    </div>
  );
}
