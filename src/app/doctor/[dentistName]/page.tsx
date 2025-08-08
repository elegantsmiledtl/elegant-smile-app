
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { DentalCase } from '@/types';
import CasesTable from '@/components/cases-table';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCasesByDoctor } from '@/lib/firebase';
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dentistName]);
  
  if (!isMounted) {
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
                        Cases for {dentistName}
                    </h2>
                    <Button asChild>
                        <Link href={`/login?name=${encodeURIComponent(dentistName)}`}>
                            <User className="mr-2" />
                            My Cases
                        </Link>
                    </Button>
                </div>
            </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <CasesTable 
              cases={doctorCases}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
