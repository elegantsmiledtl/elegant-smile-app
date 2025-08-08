
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { DentalCase } from '@/types';
import CasesTable from '@/components/cases-table';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCasesByDoctor } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DoctorPage() {
  const params = useParams();
  const router = useRouter();
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
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if(user.name !== dentistName) {
             router.push('/login');
        }
    } else {
        router.push('/login');
    }
    fetchDoctorCases();
  }, [dentistName, router]);
  
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

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
                        Welcome, {dentistName}
                    </h2>
                    <Button onClick={handleLogout} variant="outline">
                        <LogOut className="mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                My Recorded Cases
            </h2>
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2" />
                    Back to Main Dashboard
                </Link>
            </Button>
        </div>
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
