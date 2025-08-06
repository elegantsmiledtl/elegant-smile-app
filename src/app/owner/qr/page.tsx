'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function DoctorQrCodePage() {
  const [loginUrl, setLoginUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const url = new URL('/login', window.location.origin);
      setLoginUrl(url.toString());
    }
  }, []);

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
        <CardContent className="flex justify-center p-8">
          {loginUrl ? (
            <div style={{ background: 'white', padding: '16px' }}>
              <QRCode value={loginUrl} />
            </div>
          ) : (
            <p>Generating QR code...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
