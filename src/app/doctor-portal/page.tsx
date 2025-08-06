'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DentalCase } from '@/types';
import CasesTable from '@/components/cases-table';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DoctorPortalPage() {
  const router = useRouter();
  const [allCases, setAllCases] = useState<DentalCase[]>([]);
  const [doctorCases, setDoctorCases] = useState<DentalCase[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedUser = localStorage.getItem('loggedInUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setDoctorName(user.name);
      } else {
        // If no user is logged in, redirect to login page
        router.push('/login');
      }

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
      console.error("Failed to load data from local storage", error);
    }
  }, [router]);

  useEffect(() => {
    if (doctorName && allCases.length > 0) {
      const filteredCases = allCases.filter(c => c.dentistName === doctorName);
      setDoctorCases(filteredCases);
    }
  }, [doctorName, allCases]);
  
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

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  if (!isMounted || !doctorName) {
    // Render a loading state or nothing while we check for the user
    return null; 
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader cases={allCases} setCases={setAllCases} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                <Stethoscope className="w-8 h-8" />
                Welcome, {doctorName}
            </h2>
            <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2" />
                Logout
            </Button>
        </div>
        <Card className="shadow-lg">
           <CardHeader>
            <CardTitle>Your Cases</CardTitle>
          </CardHeader>
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
