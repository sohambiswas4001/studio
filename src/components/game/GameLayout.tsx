"use client";

import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DrawingCanvas, type DrawingCanvasRef } from '@/components/game/DrawingCanvas';
import { GameHeader } from '@/components/game/GameHeader';
import { GuessingArea, type Message } from '@/components/game/GuessingArea';
import { Scoreboard, type Player } from '@/components/game/Scoreboard';
import { Toolbar } from '@/components/game/Toolbar';

export function GameLayout({ roomId }: { roomId: string }) {
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [playerName, setPlayerName] = useState<string | null>(null);
  
  useEffect(() => {
    const name = searchParams.get('player');
    setPlayerName(name);

    if (name) {
      // In a real app, you'd fetch players from a server/DB
      // and check if you are re-joining.
      // For now, we just add the new player.
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(7),
        name: name,
        score: 0,
        isDrawer: true // For now, the first player is always the drawer.
      };
      setPlayers(prev => [...prev, newPlayer]);
      
      const newMessage: Message = {
        id: Math.random().toString(),
        type: 'system',
        text: `${name} has joined the room!`,
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [searchParams]);

  // In a real app, this would be determined by game state and user session
  const isCurrentUserDrawer = true;

  const handleClearCanvas = () => {
    canvasRef.current?.clear();
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleToggleFillMode = () => {
    canvasRef.current?.toggleFillMode();
  };

  return (
    <div className="min-h-screen p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[350px_1fr_350px] gap-4">
      <div className="hidden lg:block">
        <Scoreboard players={players} />
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
            onUndo={handleUndo}
            onFill={handleToggleFillMode}
          />
        )}
      </main>
      
      <div className="hidden lg:block">
        <GuessingArea messages={messages} />
      </div>

       {/* Mobile layout: show scoreboard and guess area below main content */}
       <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          <Scoreboard players={players} />
          <GuessingArea messages={messages} />
       </div>

    </div>
  );
}
