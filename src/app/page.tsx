"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { PartyPopper, LogIn, Cog, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [roundTime, setRoundTime] = useState(90);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = () => {
    if (!playerName.trim()) return;
    setIsLoading(true);
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/game/${roomId}?player=${encodeURIComponent(playerName)}&time=${roundTime}&difficulty=${difficulty}`);
  };
  
  const handleJoinRoom = () => {
    if (!playerName.trim() || !joinRoomId.trim()) return;
    setIsLoading(true);
    router.push(`/game/${joinRoomId.trim()}?player=${encodeURIComponent(playerName)}`);
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
          <CardDescription>Enter your name to create or join a room.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName">Your Name</Label>
            <Input 
              id="playerName" 
              placeholder="e.g., Captain Doodler" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-center text-lg h-12"
              aria-label="Player Name"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateRoom} className="w-full" size="lg" disabled={!playerName.trim() || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PartyPopper className="mr-2 h-5 w-5" />}
              Create Private Room
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="px-3">
                  <Cog className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Game Settings</SheetTitle>
                  <SheetDescription>
                    Adjust the settings for the new game room.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <Label htmlFor="round-time">Round Time (seconds)</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            id="round-time"
                            min={30}
                            max={180}
                            step={15}
                            value={[roundTime]}
                            onValueChange={(value) => setRoundTime(value[0])}
                        />
                        <span className="font-bold text-lg w-12 text-center">{roundTime}s</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="difficulty">Word Difficulty</Label>
                    <RadioGroup 
                        id="difficulty"
                        value={difficulty} 
                        onValueChange={(value: Difficulty) => setDifficulty(value)}
                        className="grid grid-cols-3 gap-2"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="r1" />
                            <Label htmlFor="r1">Beginner</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="r2" />
                            <Label htmlFor="r2">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="advanced" id="r3" />
                            <Label htmlFor="r3">Advanced</Label>
                        </div>
                    </RadioGroup>
                  </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button>Save changes</Button>
                    </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or
                </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="joinRoomId">Room ID</Label>
                <Input 
                id="joinRoomId" 
                placeholder="Enter Room ID to join" 
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="text-center text-lg h-12"
                aria-label="Room ID"
                />
            </div>
            <Button onClick={handleJoinRoom} className="w-full" size="lg" variant="secondary" disabled={!playerName.trim() || !joinRoomId.trim() || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                Join Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
