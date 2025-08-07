
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// In a real application, you would use Firebase Auth or another auth provider.
// This is a simplified example.
const DUMMY_USERS = [
  { email: 'dr.smith@example.com', password: 'password123', name: 'Dr. Smith' },
  { email: 'dr.jones@example.com', password: 'password123', name: 'Dr. Jones' },
  { email: 'ahmad@example.com', password: '123456', name: 'ahmad' },
  { email: 'dr.ibraheem.omar@example.com', password: 'drhema', name: 'Dr.Ibraheem Omar' },
];

// Function to get users, allowing for runtime additions for the prototype
const getUsers = () => {
    if (typeof window !== 'undefined') {
        const storedUsers = sessionStorage.getItem('dummyUsers');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
        sessionStorage.setItem('dummyUsers', JSON.stringify(DUMMY_USERS));
        return DUMMY_USERS;
    }
    return DUMMY_USERS;
};


function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState(DUMMY_USERS);

  useEffect(() => {
    setUsers(getUsers());
    const prefilledName = searchParams.get('name');
    if (prefilledName) {
      setName(decodeURIComponent(prefilledName));
    }
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = users.find(
        (u) => u.name === name && u.password === password
      );

      if (user) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
        // In a real app, you'd store a session token. Here, we'll just redirect.
        localStorage.setItem('loggedInUser', JSON.stringify({ name: user.name, email: user.email }));
        router.push(`/doctor-portal`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid name or password.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
       <div className="absolute top-8 left-8">
         <h1 className="text-2xl font-bold text-foreground">Elegant Smile</h1>
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Doctor Portal Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your cases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g. Dr. Smith"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    )
}

export const addUser = (newUser: any) => {
    if (typeof window !== 'undefined') {
        const currentUsers = getUsers();
        const updatedUsers = [...currentUsers, newUser];
        sessionStorage.setItem('dummyUsers', JSON.stringify(updatedUsers));
    }
};
