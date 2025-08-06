
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import CaseEntryForm from '@/components/case-entry-form';
import type { DentalCase } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, Suspense } from 'react';
import CasesTable from '@/components/cases-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Smartphone } from 'lucide-react';
import { getCases, addCase, updateCase, deleteCase } from '@/lib/firebase';

function AddCasePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(Date.now()); // Add key state to re-mount the form
  const [cases, setCases] = useState<DentalCase[]>([]);

  const source = searchParams.get('source') as 'Mobile' | 'Desktop' | null;

  const handleFirebaseError = (error: any) => {
    console.error("Firebase Error:", error);
    let description = 'An unexpected error occurred.';
    if (error.code === 'permission-denied') {
        description = 'You have insufficient permissions to access the database. Please update your Firestore security rules in the Firebase console.';
    }
    toast({
        variant: 'destructive',
        title: 'Database Error',
        description: description,
        action: error.code === 'permission-denied' ? (
            <a href="https://console.firebase.google.com/project/elegant-smile-r6jex/firestore/rules" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">Fix Rules</Button>
            </a>
        ) : undefined,
    });
  };

  const fetchCases = async () => {
    try {
        const casesFromDb = await getCases();
        setCases(casesFromDb);
    } catch (error) {
        handleFirebaseError(error);
    }
  };
  
  useEffect(() => {
    setIsMounted(true);
    fetchCases();
  }, []);

  const handleAddCase = async (newCase: Omit<DentalCase, 'id' | 'createdAt'>) => {
    if (!isMounted) return;
    try {
      const caseWithSource = { 
          ...newCase, 
          source: source === 'Mobile' ? 'Mobile' : 'Desktop'
      };
      await addCase(caseWithSource);
      await fetchCases(); // Re-fetch all cases to update the table
      
      toast({
        title: 'GOT IT',
        description: `Case for ${newCase.patientName} has been successfully added.`,
      });

      // Reset the form by changing the key, which forces a re-render
      setKey(Date.now());

    } catch (error) {
       handleFirebaseError(error);
    }
  };
  
  const handleDeleteCase = async (id: string) => {
    try {
        await deleteCase(id);
        setCases(prevCases => prevCases.filter(c => c.id !== id));
        toast({ title: "Success", description: "Case deleted successfully." });
    } catch (error) {
        handleFirebaseError(error);
    }
  };
  
  const handleUpdateCase = async (updatedCase: DentalCase) => {
    try {
        await updateCase(updatedCase.id, updatedCase);
        setCases(prevCases => prevCases.map(c => c.id === updatedCase.id ? updatedCase : c));
        toast({ title: "Success", description: "Case updated successfully." });
    } catch (error) {
        handleFirebaseError(error);
    }
  };

  const handleUpdate = () => {
    // This page is only for adding, so we redirect home if an update is triggered.
    router.push('/');
  }

  if (!isMounted) {
      return null;
  }
  
  const isMobileSource = source === 'Mobile';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Elegant Smile</h1>
           {isMobileSource ? (
            <div className="flex items-center gap-2 text-primary">
              <Smartphone />
              <span className="font-semibold">Mobile Entry Mode</span>
            </div>
          ) : (
            <Button asChild variant="outline">
              <Link href="/">
                  <Home className="mr-2" />
                  Back to Home
              </Link>
            </Button>
          )}
        </div>
      </header>
      <main className={`p-4 sm:p-6 lg:p-8 ${isMobileSource ? 'grid grid-cols-1' : 'grid md:grid-cols-2 gap-8'}`}>
        <div>
            <CaseEntryForm key={key} onAddCase={handleAddCase} onUpdate={handleUpdate} />
        </div>
        {!isMobileSource && (
            <div>
                <h2 className="text-2xl font-bold mb-4">Saved Cases</h2>
                <CasesTable 
                    cases={cases} 
                    onDeleteCase={handleDeleteCase}
                    onUpdateCase={handleUpdateCase}
                />
            </div>
        )}
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
