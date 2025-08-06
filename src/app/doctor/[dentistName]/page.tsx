'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { DentalCase } from '@/types';
import CasesTable from '@/components/cases-table';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { getCasesByDoctor, deleteCase, updateCase } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DoctorPage() {
  const params = useParams();
  const dentistName = params.dentistName ? decodeURIComponent(params.dentistName as string) : '';
  const [doctorCases, setDoctorCases] = useState<DentalCase[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

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

  const fetchDoctorCases = async () => {
      if(dentistName) {
        try {
            const casesFromDb = await getCasesByDoctor(dentistName);
            setDoctorCases(casesFromDb);
        } catch (error) {
            handleFirebaseError(error);
        }
      }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchDoctorCases();
  }, [dentistName]);

  const handleDeleteCase = async (id: string) => {
    try {
        await deleteCase(id);
        setDoctorCases(prevCases => prevCases.filter(c => c.id !== id));
        toast({ title: "Success", description: "Case deleted successfully." });
    } catch (error) {
        handleFirebaseError(error);
    }
  };
  
  const handleUpdateCase = async (updatedCase: DentalCase) => {
    try {
        await updateCase(updatedCase.id, updatedCase);
        setDoctorCases(prevCases => prevCases.map(c => c.id === updatedCase.id ? updatedCase : c));
        toast({ title: "Success", description: "Case updated successfully." });
    } catch (error) {
        handleFirebaseError(error);
    }
  };

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader cases={doctorCases} setCases={setDoctorCases} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                <Stethoscope className="w-8 h-8" />
                Cases for {dentistName}
            </h2>
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2" />
                    Back to Home
                </Link>
            </Button>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <CasesTable 
              cases={doctorCases} 
              onDeleteCase={handleDeleteCase} 
              onUpdateCase={handleUpdateCase}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
