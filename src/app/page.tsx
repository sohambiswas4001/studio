"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { PartyPopper, Users } from 'lucide-react';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/game/${roomId}?player=${encodeURIComponent(playerName)}`);
  };
  
  const handleJoinPublic = () => {
    if (!playerName.trim()) return;
    router.push(`/game/public-lobby?player=${encodeURIComponent(playerName)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-grid-pink-500/[0.2]">
      <div className="text-center mb-8">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-2">Doodle Dash</h1>
        <p className="text-lg md:text-xl text-foreground/80">A real-time drawing and guessing game powered by AI.</p>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-background/80">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Get Started</CardTitle>
          <CardDescription>Enter your name to join the fun!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="sr-only">Your Name</Label>
            <Input 
              id="playerName" 
              placeholder="e.g., Captain Doodler" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-center text-lg h-12"
              aria-label="Player Name"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleCreateRoom} className="w-full" size="lg" disabled={!playerName.trim()}>
            <PartyPopper className="mr-2 h-5 w-5" />
            Create Private Room
          </Button>
          <Button onClick={handleJoinPublic} className="w-full" size="lg" variant="secondary" disabled={!playerName.trim()}>
            <Users className="mr-2 h-5 w-5" />
            Join Public Game
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
