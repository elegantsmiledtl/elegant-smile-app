
import React from 'react';
import Image from 'next/image';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 
        Once you add your logo to the /public folder (e.g., /public/logo.png), 
        change the src below to "/logo.png" 
      */}
      <Image 
        src="https://placehold.co/40x40.png" 
        alt="Elegant Smile Logo" 
        width={40} 
        height={40}
        data-ai-hint="logo"
      />
      <h1 className="text-2xl font-bold font-headline text-foreground">Elegant Smile</h1>
    </div>
  );
};

export default Logo;
