
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ToothProps {
  number: number;
  isSelected: boolean;
  onClick: (number: number) => void;
  x: number;
  y: number;
}

const Tooth: React.FC<ToothProps> = ({ number, isSelected, onClick, x, y }) => (
  <g transform={`translate(${x}, ${y})`} onClick={() => onClick(number)} className="cursor-pointer group">
    <circle r="12" fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--card))'} stroke="hsl(var(--primary))" strokeWidth="1" className="group-hover:fill-primary/20 transition-colors" />
    <text x="0" y="4" textAnchor="middle" fontSize="10" fill={isSelected ? 'hsl(var(--card))' : 'hsl(var(--primary))'} className="font-sans select-none group-hover:fill-primary-foreground transition-colors">{number}</text>
  </g>
);

const upperArchCoords = [
  { x: 30, y: 110 }, { x: 40, y: 80 }, { x: 55, y: 55 }, { x: 75, y: 35 }, { x: 100, y: 20 }, { x: 125, y: 12 }, { x: 150, y: 10 }, { x: 175, y: 10 },
  { x: 200, y: 12 }, { x: 225, y: 20 }, { x: 250, y: 35 }, { x: 270, y: 55 }, { x: 285, y: 80 }, { x: 295, y: 110 }, { x: 300, y: 140 }, { x: 300, y: 170 }
].reverse(); // Reverse for right-to-left rendering

const lowerArchCoords = [
  { x: 30, y: 265 }, { x: 40, y: 295 }, { x: 55, y: 325 }, { x: 75, y: 345 }, { x: 100, y: 360 }, { x: 125, y: 368 }, { x: 150, y: 370 }, { x: 175, y: 370 },
  { x: 200, y: 368 }, { x: 225, y: 360 }, { x: 250, y: 345 }, { x: 270, y: 325 }, { x: 285, y: 300 }, { x: 295, y: 270 }, { x: 300, y: 240 }, { x: 300, y: 210 }
].reverse(); // Reverse for right-to-left rendering

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
      <PopoverContent className="w-[350px] p-4">
        <div className="flex justify-center items-center">
            <svg width="330" height="400" viewBox="0 0 330 400">
                <text x="280" y="20" fontSize="12" fill="hsl(var(--foreground))" textAnchor="end">Right</text>
                <text x="50" y="20" fontSize="12" fill="hsl(var(--foreground))" textAnchor="start">Left</text>
                
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
                
                <text x="280" y="390" fontSize="12" fill="hsl(var(--foreground))" textAnchor="end">Right</text>
                <text x="50" y="390" fontSize="12" fill="hsl(var(--foreground))" textAnchor="start">Left</text>
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
