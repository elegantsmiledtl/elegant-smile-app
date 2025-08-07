
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
import { QrCode, Users, PlusCircle, Trash2 } from 'lucide-react';
import { getCases, deleteCase, updateCase } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { getUsers, addUser, deleteUser } from '../login/page';
import AddDoctorForm from '@/components/add-doctor-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


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
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [isAddDoctorDialogOpen, setIsAddDoctorDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);

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

  const fetchUsers = () => {
    setAllUsers(getUsers());
  }

  useEffect(() => {
    setIsMounted(true);
    fetchCases();
    fetchUsers();
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

  const handleAddDoctor = (values: { name: string; password: string }) => {
    addUser(values);
    toast({
      title: 'Doctor Added',
      description: `User for ${values.name} has been created.`,
    });
    fetchUsers(); // Refresh user list
    setIsAddDoctorDialogOpen(false); // Close dialog
  };

  const handleDeleteUser = (name: string) => {
    deleteUser(name);
     toast({
      title: 'Doctor Deleted',
      description: `The user has been deleted.`,
    });
    fetchUsers(); // Refresh user list
  };

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
                <div className="flex items-center gap-2">
                    <Dialog open={isAddDoctorDialogOpen} onOpenChange={setIsAddDoctorDialogOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline">
                                <PlusCircle className="mr-2" />
                                Add New Doctor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Doctor User</DialogTitle>
                                 <DialogDescription>
                                    Create a new login for a doctor to access the portal.
                                </DialogDescription>
                            </DialogHeader>
                            <AddDoctorForm onAddDoctor={handleAddDoctor} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline">
                                <Users className="mr-2" />
                                Manage Users
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>All Registered Users</DialogTitle>
                                 <DialogDescription>
                                    This is a list of all users who can log in to the doctor portal.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="rounded-md border mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Password</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allUsers.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.password}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.name)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </DialogContent>
                    </Dialog>
                     <Button asChild variant="outline">
                      <Link href="/owner/qr">
                        <QrCode className="mr-2" />
                        Doctor Portal QR Code
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/owner/qr-ibraheem">
                        <QrCode className="mr-2" />
                        Generate QR for Dr.Ibraheem
                      </Link>
                    </Button>
                </div>
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
