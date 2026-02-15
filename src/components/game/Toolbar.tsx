"use client";

import { Eraser, Paintbrush, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const COLORS = [
  '#000000', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#FFFFFF'
];

const ERASER_COLOR = '#F0F8FF' // Matches --background HSL

interface ToolbarProps {
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  onClear: () => void;
}

export function Toolbar({ color, setColor, lineWidth, setLineWidth, onClear }: ToolbarProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-2 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                color === c && c !== ERASER_COLOR ? 'border-primary scale-110' : 'border-transparent',
                c === '#FFFFFF' && 'border-muted'
              )}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
          <Button variant="ghost" size="icon" onClick={() => setColor(ERASER_COLOR)} aria-label="Eraser">
             <Eraser className={cn(color === ERASER_COLOR && 'text-primary')}/>
          </Button>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <Paintbrush className="h-5 w-5" />
           <Slider
             min={1}
             max={50}
             step={1}
             value={[lineWidth]}
             onValueChange={(value) => setLineWidth(value[0])}
             className="w-32"
           />
        </div>
        <Button variant="destructive" size="icon" onClick={onClear} aria-label="Clear canvas">
          <Trash2 />
        </Button>
      </CardContent>
    </Card>
  );
}
