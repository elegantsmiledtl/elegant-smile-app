
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function DoctorMatarQrCodePage() {
  const [loginUrl, setLoginUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL('/login', window.location.origin);
      url.searchParams.set('name', 'Dr.Matar');
      setLoginUrl(url.toString());
    }
  }, []);

  const copyToClipboard = () => {
    if (loginUrl) {
      navigator.clipboard.writeText(loginUrl).then(() => {
        toast({
          title: "Copied!",
          description: "Login URL has been copied to your clipboard.",
        });
      }, (err) => {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy URL to clipboard.",
        });
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
       <div className="absolute top-8 left-8">
         <h1 className="text-2xl font-bold text-foreground font-headline">Elegant Smile</h1>
      </div>
       <div className="absolute top-8 right-8">
         <Button asChild variant="outline">
            <Link href="/owner">
                <Home className="mr-2" />
                Back to Owner View
            </Link>
          </Button>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">QR Code for Dr.Matar</CardTitle>
          <CardDescription>
            Dr.Matar can scan this QR code to log in to the doctor portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 gap-8">
          {loginUrl ? (
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
              <QRCode value={loginUrl} size={256} />
            </div>
          ) : (
            <div className="h-[288px] w-[288px] flex items-center justify-center">
              <p>Generating QR code...</p>
            </div>
          )}
          <div className="w-full space-y-2">
            <Label htmlFor="portal-url">Portal Login URL</Label>
            <div className="flex w-full items-center space-x-2">
                <Input id="portal-url" type="text" value={loginUrl} readOnly />
                <Button type="button" onClick={copyToClipboard} variant="secondary">Copy</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
