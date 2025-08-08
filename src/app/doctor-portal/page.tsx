
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DentalCase } from '@/types';
import CaseEntryForm from '@/components/case-entry-form';
import CasesTable from '@/components/cases-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Home, LogOut, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCasesByDoctor, addCase, updateCase, deleteCase } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DoctorPortalPage() {
  const router = useRouter();
  const [dentistName, setDentistName] = useState('');
  const [doctorCases, setDoctorCases] = useState<DentalCase[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState(Date.now()); // For resetting the form
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        setDentistName(user.name);
    } else {
        router.push('/login');
    }
  }, [router]);
  
  useEffect(() => {
    if (dentistName) {
        fetchDoctorCases();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dentistName]);

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

  const handleAddCase = async (newCase: Omit<DentalCase, 'id' | 'createdAt'>) => {
    try {
      await addCase({ ...newCase, dentistName });
      await fetchDoctorCases();
      toast({
        title: 'Case Added',
        description: `Case for ${newCase.patientName} has been successfully added.`,
      });
      setKey(Date.now()); // Reset form
    } catch (error) {
      handleFirebaseError(error);
    }
  };

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
  
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  if (!isMounted || !dentistName) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
        <header className="bg-card border-b shadow-sm p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Elegant Smile</h1>
                <div className="flex items-center gap-4">
                     <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Stethoscope className="w-6 h-6" />
                        Welcome, {dentistName}
                    </h2>
                    <Button onClick={handleLogout} variant="outline">
                        <LogOut className="mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <CaseEntryForm 
                key={key} 
                onAddCase={handleAddCase} 
                caseToEdit={{ dentistName: dentistName }} // Pre-fill dentist name
            />
        </div>
        <div className="md:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-primary" />
                        My Recorded Cases
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <CasesTable 
                      cases={doctorCases}
                      onDeleteCase={handleDeleteCase}
                      onUpdateCase={handleUpdateCase}
                    />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
