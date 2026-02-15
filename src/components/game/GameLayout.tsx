"use client";

import { useRef, useState } from 'react';
import { DrawingCanvas, type DrawingCanvasRef } from '@/components/game/DrawingCanvas';
import { GameHeader } from '@/components/game/GameHeader';
import { GuessingArea } from '@/components/game/GuessingArea';
import { Scoreboard } from '@/components/game/Scoreboard';
import { Toolbar } from '@/components/game/Toolbar';

export function GameLayout({ roomId }: { roomId: string }) {
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  // In a real app, this would be determined by game state and user session
  const isCurrentUserDrawer = true;

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  return (
    <div className="min-h-screen p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[350px_1fr_350px] gap-4">
      <div className="hidden lg:block">
        <Scoreboard />
      </div>
      
      <main className="flex flex-col gap-4 min-w-0">
        <GameHeader isDrawer={isCurrentUserDrawer} roomId={roomId} />
        <DrawingCanvas 
          ref={canvasRef}
          color={isCurrentUserDrawer ? color : 'transparent'} // Non-drawers can't draw
          lineWidth={lineWidth}
        />
        {isCurrentUserDrawer && (
          <Toolbar 
            color={color}
            setColor={setColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            onClear={handleClearCanvas}
          />
        )}
      </main>
      
      <div className="hidden lg:block">
        <GuessingArea />
      </div>

       {/* Mobile layout: show scoreboard and guess area below main content */}
       <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          <Scoreboard />
          <GuessingArea />
       </div>

    </div>
  );
}
