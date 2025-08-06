'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileText, FileJson, FileUp, Sparkles, QrCode, PlusCircle, User, LogIn } from 'lucide-react';
import type { DentalCase } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { convertJsonToCsv, downloadFile, generateReport } from '@/lib/utils';
import Logo from './logo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import QRCode from "react-qr-code";
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';


interface PageHeaderProps {
  cases: DentalCase[];
  setCases: React.Dispatch<React.SetStateAction<DentalCase[]>>;
}

export default function PageHeader({ cases, setCases }: PageHeaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addCaseUrl, setAddCaseUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const url = new URL('/add-case', window.location.origin);
      url.searchParams.set('source', 'Mobile');
      setAddCaseUrl(url.toString());
    }
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const importedCases = JSON.parse(text, (key, value) => {
            if (key === 'dueDate' && typeof value === 'string') {
              return new Date(value);
            }
            return value;
          });

          // Basic validation
          if (Array.isArray(importedCases) && importedCases.every(c => c.id && c.patientName)) {
            setCases(importedCases);
            toast({
              title: "Success",
              description: "Successfully imported cases from JSON file.",
            });
          } else {
            throw new Error("Invalid JSON file format.");
          }

        } catch (error) {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: error instanceof Error ? error.message : "Could not parse the JSON file.",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if(event.target) {
      event.target.value = '';
    }
  };

  const handleExportJson = () => {
    if (cases.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data',
        description: 'There are no cases to export.',
      });
      return;
    }
    const jsonString = JSON.stringify(cases, null, 2);
    downloadFile(jsonString, 'elegant-smile-data.json', 'application/json');
    toast({
      title: 'Export Successful',
      description: 'Cases have been exported to JSON.',
    });
  };

  const handleExportCsv = () => {
    if (cases.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data',
        description: 'There are no cases to export.',
      });
      return;
    }
    try {
      const csvString = convertJsonToCsv(cases);
      downloadFile(csvString, 'elegant-smile-data.csv', 'text/csv');
      toast({
        title: 'Export Successful',
        description: 'Cases have been exported to CSV.',
      });
    } catch(error) {
        toast({
            variant: "destructive",
            title: "Export Failed",
            description: "Could not convert data to CSV.",
        });
    }
  };

  const handleGenerateReport = () => {
     if (cases.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data',
        description: 'There is no data to generate a report from.',
      });
      return;
    }
    const reportText = generateReport(cases);
    downloadFile(reportText, 'dental-lab-report.txt', 'text/plain');
    toast({
      title: 'Report Generated',
      description: 'A summary report has been downloaded.',
    });
  };

  return (
    <header className="bg-card border-b shadow-sm p-4">
      <Toaster />
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-2">
            <Button asChild size="sm">
                <Link href="/owner">
                    <User className="mr-2 h-4 w-4" /> Owner View
                </Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Doctor Portal
                </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
                <a href="/add-case">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Case
                </a>
            </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <QrCode className="mr-2 h-4 w-4" /> Add Case (Mobile)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Case via QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4 justify-center">
                {addCaseUrl ? (
                    <div style={{ background: 'white', padding: '16px' }}>
                        <QRCode value={addCaseUrl} />
                    </div>
                ) : <p>Generating QR code...</p>}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Scan this with a mobile device to add a new case.
              </p>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleImportClick}>
            <FileUp className="mr-2 h-4 w-4" /> Import JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJson}>
            <FileJson className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>
    </header>
  );
}
