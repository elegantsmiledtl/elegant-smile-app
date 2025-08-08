
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// SVG paths for different tooth shapes
const ToothShapes = {
    incisorUpper: "M-4,-8 C-7,-4 -7,2 -4,6 L4,6 C7,2 7,-4 4,-8 Z",
    canineUpper: "M-4,-8 C-6,-2 -4,4 0,7 C4,4 6,-2 4,-8 Z",
    premolarUpper: "M-5,-6 C-8,-2 -8,4 -5,7 L5,7 C8,4 8,-2 5,-6 Z",
    molarUpper: "M-6,-5 C-9,0 -9,5 -6,8 L6,8 C9,5 9,0 6,-5 Z",
    incisorLower: "M-3,-7 C-5,-2 -5,3 -3,6 L3,6 C5,3 5,-2 3,-7 Z",
    canineLower: "M-4,-7 C-5,-2 -4,3 0,6 C4,3 5,-2 4,-7 Z",
    premolarLower: "M-5,-6 C-7,-1 -7,5 -5,7 L5,7 C7,5 7,-1 5,-6 Z",
    molarLower: "M-6,-5 C-8,0 -8,6 -6,8 L6,8 C8,6 8,0 6,-5 Z",
};

// Map tooth numbers to shapes and transformations
const getToothShape = (number: number) => {
    // Upper Teeth (11-28)
    if (number >= 11 && number <= 12 || number >= 21 && number <= 22) return ToothShapes.incisorUpper;
    if (number === 13 || number === 23) return ToothShapes.canineUpper;
    if (number >= 14 && number <= 15 || number >= 24 && number <= 25) return ToothShapes.premolarUpper;
    if (number >= 16 && number <= 18 || number >= 26 && number <= 28) return ToothShapes.molarUpper;
    // Lower Teeth (31-48)
    if (number >= 31 && number <= 32 || number >= 41 && number <= 42) return ToothShapes.incisorLower;
    if (number === 33 || number === 43) return ToothShapes.canineLower;
    if (number >= 34 && number <= 35 || number >= 44 && number <= 45) return ToothShapes.premolarLower;
    if (number >= 36 && number <= 38 || number >= 46 && number <= 48) return ToothShapes.molarLower;

    return ToothShapes.incisorUpper; // Default
};


interface ToothProps {
  number: number;
  isSelected: boolean;
  onClick: (number: number) => void;
  x: number;
  y: number;
}

const Tooth: React.FC<ToothProps> = ({ number, isSelected, onClick, x, y }) => {
    const shape = getToothShape(number);
    const isUpper = number < 30;
    const transform = isUpper ? "" : "scale(1, -1)";

    return (
        <g transform={`translate(${x}, ${y})`} onClick={() => onClick(number)} className="cursor-pointer group">
            <path d={shape} transform={transform} fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--card))'} stroke="hsl(var(--foreground))" strokeWidth="0.5" className="group-hover:fill-primary/20 transition-colors" />
            <text x="0" y={isUpper ? 22 : -15} textAnchor="middle" fontSize="10" fill="hsl(var(--foreground))" className="font-sans select-none">{number}</text>
        </g>
    )
};


const upperArchCoords = [
  { x: 280, y: 110 }, { x: 265, y: 85 }, { x: 245, y: 65 }, { x: 225, y: 50 }, { x: 200, y: 40 }, { x: 175, y: 35 }, { x: 150, y: 35 }, { x: 125, y: 35 },
  { x: 100, y: 35 }, { x: 75, y: 40 }, { x: 50, y: 50 }, { x: 30, y: 65 }, { x: 15, y: 85 }, { x: 5, y: 110 }, { x: 0, y: 140 }, { x: 0, y: 170 } // Not in image
].reverse();

const lowerArchCoords = [
  { x: 280, y: 180 }, { x: 265, y: 205 }, { x: 245, y: 225 }, { x: 225, y: 240 }, { x: 200, y: 250 }, { x: 175, y: 255 }, { x: 150, y: 255 }, { x: 125, y: 255 },
  { x: 100, y: 255 }, { x: 75, y: 250 }, { x: 50, y: 240 }, { x: 30, y: 225 }, { x: 15, y: 205 }, { x: 5, y: 180 }, { x: 0, y: 150 }, { x: 0, y: 120 } // Not in image
].reverse();


// FDI World Dental Federation notation
const upperArchTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerArchTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];


interface ToothSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ToothSelector({ value, onChange }: ToothSelectorProps) {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setSelectedTeeth(value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)));
    } else {
      setSelectedTeeth([]);
    }
  }, [value]);

  const handleToothClick = (toothNumber: number) => {
    const newSelectedTeeth = selectedTeeth.includes(toothNumber)
      ? selectedTeeth.filter(n => n !== toothNumber)
      : [...selectedTeeth, toothNumber];
    
    newSelectedTeeth.sort((a,b) => a-b);
    setSelectedTeeth(newSelectedTeeth);
    onChange(newSelectedTeeth.join(', '));
  };
  
  const handleClear = () => {
    setSelectedTeeth([]);
    onChange('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Select tooth/teeth"
          value={value}
          readOnly
          className="cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex justify-center items-center">
            <svg width="300" height="300" viewBox="0 0 300 300">
                <text x="260" y="20" fontSize="12" fill="hsl(var(--foreground))" textAnchor="end">Right</text>
                <text x="40" y="20" fontSize="12" fill="hsl(var(--foreground))" textAnchor="start">Left</text>
                
                {upperArchTeeth.map((num, index) => (
                    <Tooth
                    key={num}
                    number={num}
                    isSelected={selectedTeeth.includes(num)}
                    onClick={handleToothClick}
                    x={upperArchCoords[index].x}
                    y={upperArchCoords[index].y}
                    />
                ))}

                {lowerArchTeeth.map((num, index) => (
                    <Tooth
                    key={num}
                    number={num}
                    isSelected={selectedTeeth.includes(num)}
                    onClick={handleToothClick}
                    x={lowerArchCoords[index].x}
                    y={lowerArchCoords[index].y}
                    />
                ))}
                
                 <text x="260" y="290" fontSize="12" fill="hsl(var(--foreground))" textAnchor="end">Right</text>
                <text x="40" y="290" fontSize="12" fill="hsl(var(--foreground))" textAnchor="start">Left</text>
            </svg>
        </div>
        <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
            <Button size="sm" onClick={() => setIsOpen(false)}>Done</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
