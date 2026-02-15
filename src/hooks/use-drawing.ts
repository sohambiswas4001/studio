"use client";

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };

export function useDrawing(
  onDraw: (ctx: CanvasRenderingContext2D, point: Point, prevPoint: Point | null) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<Point | null>(null);
  const isDrawingRef = useRef(false);

  const getCanvasPoint = (e: MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      prevPointRef.current = getCanvasPoint(e);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const point = getCanvasPoint(e);
      if (point) {
        onDraw(ctx, point, prevPointRef.current);
        prevPointRef.current = point;
      }
    };

    const handleEnd = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };

    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    // Touch events
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [onDraw]);

  return { canvasRef };
}
