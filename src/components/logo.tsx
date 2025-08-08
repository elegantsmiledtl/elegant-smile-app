
import React from 'react';
import Image from 'next/image';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 
        This is now pointing to /logo.png. 
        Please upload your logo image to the /public folder and name it 'logo.png'.
      */}
      <Image 
        src="/logo.png" 
        alt="Elegant Smile Logo" 
        width={40} 
        height={40}
        data-ai-hint="logo"
      />
    </div>
  );
};

export default Logo;
