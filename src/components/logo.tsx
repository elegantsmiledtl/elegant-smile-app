import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <div className="flex items-center gap-2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="50"
            height="50"
            {...props}
        >
            <defs>
                <linearGradient id="toothGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(200, 90%, 75%)', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <g transform="translate(5, -10)">
                <path
                    d="M45.65,23.126 C53.3,23.126 59.5,29.87 59.5,37.28 C59.5,44.69 53.3,50.1 45.65,50.1 L45.65,65.8 C45.65,71.05 41.5,75.2 36.25,75.2 L36.25,75.2 C31,75.2 26.85,71.05 26.85,65.8 L26.85,50.1 C19.2,50.1 13,44.69 13,37.28 C13,29.87 19.2,23.126 26.85,23.126 L45.65,23.126 Z"
                    fill="url(#toothGradient)"
                    transform="translate(15, 15) scale(1.2)"
                />
                 <path
                    d="M 20 60 A 45 15 0 1 0 80 60 A 45 15 0 1 0 20 60"
                    fill="none"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="3"
                    transform="translate(0, 5)"
                />
            </g>
        </svg>
        <span className="text-2xl font-bold font-headline text-foreground">
            Elegant Smile
        </span>
    </div>
);

export default Logo;
