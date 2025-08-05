'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import CaseEntryForm from '@/components/case-entry-form';
import type { DentalCase } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import { useEffect, useState, Suspense } from 'react';
import CasesTable from '@/components/cases-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';

function AddCasePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(Date.now()); // Add key state to re-mount the form
  const [cases, setCases] = useState<DentalCase[]>([]);

  const source = searchParams.get('source') as 'Mobile' | 'Desktop' | null;

  useEffect(() => {
    setIsMounted(true);
    try {
        const savedCases = localStorage.getItem('dentalCases');
        if (savedCases) {
            const parsedCases = JSON.parse(savedCases, (key, value) => {
                if (key === 'dueDate') {
                    return new Date(value);
                }
                return value;
            });
            setCases(parsedCases);
        }
    } catch (error) {
        console.error("Failed to load cases from local storage", error);
    }
  }, []);

  useEffect(() => {
    if(isMounted) {
      try {
        localStorage.setItem('dentalCases', JSON.stringify(cases));
      } catch (error) {
        console.error("Failed to save cases to local storage", error);
      }
    }
  }, [cases, isMounted]);

  const handleAddCase = (newCase: Omit<DentalCase, 'id'>) => {
    if (!isMounted) return;
    try {
      const newCaseWithId: DentalCase = { 
          ...newCase, 
          id: crypto.randomUUID(),
          source: source === 'Mobile' ? 'Mobile' : 'Desktop'
      };
      const updatedCases = [...cases, newCaseWithId];
      setCases(updatedCases);
      
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
  
  const handleDeleteCase = (id: string) => {
    const updatedCases = cases.filter(c => c.id !== id);
    setCases(updatedCases);
  };
  
  const handleUpdateCase = (updatedCase: DentalCase) => {
    const updatedCases = cases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setCases(updatedCases);
  };

  const handleUpdate = () => {
    // This page is only for adding, so we redirect home if an update is triggered.
    router.push('/');
  }

  if (!isMounted) {
      return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <Button asChild variant="outline">
            <Link href="/">
                <Home className="mr-2" />
                Back to Home
            </Link>
          </Button>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 grid md:grid-cols-2 gap-8">
        <div>
            <CaseEntryForm key={key} onAddCase={handleAddCase} onUpdate={handleUpdate} />
        </div>
        <div>
            <h2 className="text-2xl font-bold mb-4">Saved Cases</h2>
            <CasesTable 
                cases={cases} 
                onDeleteCase={handleDeleteCase}
                onUpdateCase={handleUpdateCase}
            />
        </div>
      </main>
    </div>
  );
}


export default function AddCasePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddCasePageContent />
        </Suspense>
    )
}
