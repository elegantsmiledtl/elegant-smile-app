'use client';

import { useState, useEffect } from 'react';
import type { DentalCase } from '@/types';
import PageHeader from '@/components/page-header';
import CaseEntryForm from '@/components/case-entry-form';
import CasesTable from '@/components/cases-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function Home() {
  const [cases, setCases] = useState<DentalCase[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
    setCases(prevCases => [...prevCases, { ...newCase, id: crypto.randomUUID() }]);
  };

  const handleDeleteCase = (id: string) => {
    setCases(prevCases => prevCases.filter(c => c.id !== id));
  };
  
  const handleUpdateCase = (updatedCase: DentalCase) => {
    setCases(prevCases => prevCases.map(c => c.id === updatedCase.id ? updatedCase : c));
  }

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader cases={cases} setCases={setCases} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CaseEntryForm onAddCase={handleAddCase} />
          </div>
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <ToothIcon className="w-6 h-6 text-primary" />
                  Current Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CasesTable cases={cases} onDeleteCase={handleDeleteCase} onUpdateCase={handleUpdateCase}/>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
