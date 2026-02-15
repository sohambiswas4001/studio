"use client";

import { useDrawing } from '@/hooks/use-drawing';
import { forwardRef, useCallback, useImperativeHandle } from 'react';

interface DrawingCanvasProps {
  color: string;
  lineWidth: number;
}

export interface DrawingCanvasRef {
  clear: () => void;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ color, lineWidth }, ref) => {
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
  
  const { canvasRef } = useDrawing(drawLine);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  }));

  return (
    <div className="relative w-full aspect-video bg-white rounded-lg shadow-inner border overflow-hidden touch-none cursor-crosshair">
      <canvas ref={canvasRef} className="w-full h-full" width="1280" height="720" />
    </div>
  );
});

DrawingCanvas.displayName = "DrawingCanvas";
