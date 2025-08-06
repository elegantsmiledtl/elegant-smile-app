'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function DoctorQrCodePage() {
  const [loginUrl, setLoginUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const url = new URL('/login', window.location.origin);
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
         <Logo />
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
          <CardTitle className="text-2xl">Doctor Portal QR Code</CardTitle>
          <CardDescription>
            Share this QR code with doctors. When scanned, it will take them to the login page for the doctor portal.
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
            <p className="text-xs text-muted-foreground">
                For testing, you can copy this URL and open it in a new browser tab.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
