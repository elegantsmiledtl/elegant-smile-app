
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <h1 className="text-2xl font-bold font-headline text-primary">Elegant Smile</h1>
    </Link>
  );
}
