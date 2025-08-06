'use client';

import { useState, useEffect } from 'react';
import type { DentalCase } from '@/types';
import PageHeader from '@/components/page-header';
import CasesTable from '@/components/cases-table';
import Dashboard from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { getCases, deleteCase, updateCase } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';


const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.34 2.126a3.5 3.5 0 0 1 5.32 0l.223.245a3.5 3.5 0 0 1 .53 4.28l-1.22 2.032a2 2 0 0 0-.28 1.634l.394 2.368a2 2 0 0 1-1.033 2.29l-1.575.908a2 2 0 0 1-2.228 0l-1.574-.908a2 2 0 0 1-1.033-2.29l.394-2.368a2 2 0 0 0-.28-1.634L7.4 6.65a3.5 3.5 0 0 1 .53-4.28l.223-.245Z" />
    <path d="M20 12l-1.55 4.34a2 2 0 0 1-1.8 1.36h-9.3a2 2 0 0 1-1.8-1.36L4 12" />
    <path d="M16 18a4 4 0 0 0-8 0" />
  </svg>
);

export default function OwnerPage() {
  const [cases, setCases] = useState<DentalCase[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
  }

  const filteredCases = cases.filter(c => 
    c.dentistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader cases={cases} setCases={setCases} />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Dashboard cases={filteredCases} />
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 font-headline">
                <ToothIcon className="w-6 h-6 text-primary" />
                All Recorded Cases
                </CardTitle>
                 <Button asChild variant="outline">
                  <Link href="/owner/qr">
                    <QrCode className="mr-2" />
                    Doctor Portal QR Code
                  </Link>
                </Button>
                <div className="w-1/3">
                    <Input 
                        placeholder="Search by dentist or patient..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <CasesTable cases={filteredCases} onDeleteCase={handleDeleteCase} onUpdateCase={handleUpdateCase}/>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
