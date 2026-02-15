"use client";

import { useDrawing } from '@/hooks/use-drawing';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  color: string;
  lineWidth: number;
  onModeChange?: (mode: 'draw' | 'fill') => void;
}

export interface DrawingCanvasRef {
  clear: () => void;
  undo: () => void;
  toggleFillMode: () => void;
}

const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const canvasWidth = ctx.canvas.width;

  const hexToRgb = (hex: string) => {
      if (hex.startsWith('rgba')) {
        const [r, g, b] = hex.substring(5, hex.length - 1).split(',').map(Number);
        return [r,g,b];
      }
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
  };

  const [fillR, fillG, fillB] = hexToRgb(fillColor);

  const getPixel = (x: number, y: number) => {
      if (x < 0 || x >= canvasWidth || y < 0 || y >= ctx.canvas.height) {
          return [-1,-1,-1,-1];
      }
      const offset = (y * canvasWidth + x) * 4;
      return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
  };
  
  const setPixel = (x: number, y: number) => {
      const offset = (y * canvasWidth + x) * 4;
      data[offset] = fillR;
      data[offset + 1] = fillG;
      data[offset + 2] = fillB;
      data[offset + 3] = 255;
  };
  
  const colorsMatch = (c1: number[], c2: number[]) => {
      return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3];
  };

  const targetColor = getPixel(x, y);
  const fillColorRgb = [fillR, fillG, fillB, 255];

  if (colorsMatch(targetColor, fillColorRgb)) {
      return;
  }
  
  const stack: [number, number][] = [[x, y]];
  
  while(stack.length > 0) {
      const [curX, curY] = stack.pop()!;
      if (curX < 0 || curX >= canvasWidth || curY < 0 || curY >= ctx.canvas.height) {
          continue;
      }

      const currentColor = getPixel(curX, curY);

      if (colorsMatch(currentColor, targetColor)) {
          setPixel(curX, curY);
          stack.push([curX + 1, curY]);
          stack.push([curX - 1, curY]);
          stack.push([curX, curY + 1]);
          stack.push([curX, curY - 1]);
      }
  }
  ctx.putImageData(imageData, 0, 0);
}


export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ color, lineWidth, onModeChange }, ref) => {
  const [mode, setMode] = useState<'draw' | 'fill'>('draw');
  const [history, setHistory] = useState<ImageData[]>([]);
  const historyPointerRef = useRef(0);

  useEffect(() => {
    if(onModeChange) {
      onModeChange(mode);
    }
  }, [mode, onModeChange]);
  
  const drawLine = useCallback(
    (ctx: CanvasRenderingContext2D, point: {x: number, y: number}, prevPoint: {x: number, y: number} | null) => {
      const startPoint = prevPoint ?? point;
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [color, lineWidth]
  );
  
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const newHistory = history.slice(0, historyPointerRef.current + 1);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([...newHistory, imageData]);
    historyPointerRef.current = newHistory.length;
  }, [history]);

  const { canvasRef } = useDrawing(drawLine, saveState, mode === 'draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Initial state
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    historyPointerRef.current = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === 'fill') {
      const handleCanvasClick = (e: MouseEvent) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const canvasX = Math.floor((e.clientX - rect.left) * scaleX);
        const canvasY = Math.floor((e.clientY - rect.top) * scaleY);
        
        floodFill(ctx, canvasX, canvasY, color);
        saveState();
        setMode('draw');
      };
      
      canvas.addEventListener('click', handleCanvasClick);
      return () => {
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }
  }, [mode, color, saveState]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    },
    undo: () => {
        if (historyPointerRef.current > 0) {
            historyPointerRef.current -= 1;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const imageData = history[historyPointerRef.current];
            if (imageData) {
                ctx.putImageData(imageData, 0, 0);
            }
        }
    },
    toggleFillMode: () => {
        setMode(m => m === 'draw' ? 'fill' : 'draw');
    }
  }));

  const canvasCursorClass = mode === 'fill' ? 'cursor-copy' : 'cursor-crosshair';

  return (
    <div className={cn("relative w-full aspect-video bg-white rounded-lg shadow-inner border overflow-hidden touch-none", canvasCursorClass)}>
      <canvas ref={canvasRef} className="w-full h-full" width="1280" height="720" />
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";
