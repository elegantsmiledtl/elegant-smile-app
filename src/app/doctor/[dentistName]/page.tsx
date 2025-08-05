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

export default function DoctorPage() {
  const params = useParams();
  const dentistName = params.dentistName ? decodeURIComponent(params.dentistName as string) : '';
  const [allCases, setAllCases] = useState<DentalCase[]>([]);
  const [doctorCases, setDoctorCases] = useState<DentalCase[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCases = localStorage.getItem('dentalCases');
      if (savedCases) {
        const parsedCases: DentalCase[] = JSON.parse(savedCases, (key, value) => {
          if (key === 'dueDate') {
            return new Date(value);
          }
          return value;
        });
        setAllCases(parsedCases);
      }
    } catch (error) {
      console.error("Failed to load cases from local storage", error);
    }
  }, []);

  useEffect(() => {
    if (dentistName && allCases.length > 0) {
      const filteredCases = allCases.filter(c => c.dentistName === dentistName);
      setDoctorCases(filteredCases);
    }
  }, [dentistName, allCases]);
  
  const handleDeleteCase = (id: string) => {
    const updatedCases = allCases.filter(c => c.id !== id);
    setAllCases(updatedCases);
    localStorage.setItem('dentalCases', JSON.stringify(updatedCases));
  };
  
  const handleUpdateCase = (updatedCase: DentalCase) => {
    const updatedCases = allCases.map(c => c.id === updatedCase.id ? updatedCase : c);
    setAllCases(updatedCases);
    localStorage.setItem('dentalCases', JSON.stringify(updatedCases));
  };

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader cases={allCases} setCases={setAllCases} />
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
