
import React from 'react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 84 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
      >
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#c49c34', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#b38930', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="shine" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#white" result="specularOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specularOut" in2="SourceAlpha" operator="in" result="specularOut" />
            <feComposite in="SourceGraphic" in2="specularOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="litPaint" />
            </feMerge>
          </filter>
        </defs>
        <g fill="url(#gold-gradient)" style={{ filter: 'url(#shine)' }}>
          <path d="M48.86,4.05C46.1,1.5,42.02,1.48,39.24,4.02L38.45,4.8C35.9,7.11,35.73,10.8,37.89,13.31L42.21,18.06C42.7,18.6,42.82,19.39,42.54,20.09L41.35,22.7C40.6,24.36,41.93,26.06,43.65,25.35L47.53,23.63C48.24,23.33,49.06,23.58,49.53,24.18L54.49,30.01C56.59,32.44,60.1,32.7,62.53,30.74L63.3,30.08C65.86,27.77,66.02,24.08,63.86,21.57L59.54,16.82C59.05,16.28,58.93,15.49,59.21,14.79L60.4,12.1C61.15,10.44,59.82,8.74,58.1,9.45L54.22,11.17C53.51,11.47,52.69,11.22,52.22,10.62L47.26,4.79C46.84,4.29,49.27,4.45,48.86,4.05Z" transform="translate(-4, -4) scale(1.3)"/>
          <path d="M72.2,50.1C64.6,50.1,58.3,56,58.3,64.1C58.3,66.1,58.8,68,59.7,69.7L18.3,69.7C19.2,68,19.7,66.1,19.7,64.1C19.7,56,13.4,50.1,5.8,50.1C-1.8,50.1,-1.2,63.5,5.8,63.5C9.7,63.5,12.7,61.1,12.7,58.1C12.7,55.1,9.7,52.1,5.8,52.1C15.1,52.1,23.5,59.6,23.5,69.7L54.5,69.7C54.5,59.6,62.9,52.1,72.2,52.1C81.5,52.1,80.9,64.1,72.2,64.1C68.3,64.1,65.3,61.1,65.3,58.1C65.3,55.1,68.3,52.1,72.2,52.1Z" transform="translate(4, 10) scale(0.9)" />
        </g>
      </svg>
      <h1 className="text-2xl font-bold font-headline text-foreground">Elegant Smile</h1>
    </div>
  );
};

export default Logo;
