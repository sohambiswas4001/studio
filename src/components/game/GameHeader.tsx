"use client";

import { getNewWordAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Clock, Lightbulb, UserCheck, Copy } from 'lucide-react';
import { Badge } from '../ui/badge';

interface GameHeaderProps {
    isDrawer: boolean;
    roomId: string;
}

export function GameHeader({ isDrawer, roomId }: GameHeaderProps) {
  const [word, setWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0 && word) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, word]);

  const handleGetWord = async () => {
    // In a real app, these would come from game state
    const input = {
      drawnWords: ['house', 'cat'],
      playerSkillLevel: 'intermediate' as const
    };
    const result = await getNewWordAction(input);
    if (result.success && result.word) {
      setWord(result.word);
      setTimeLeft(90); // Reset timer
      toast({ title: 'New Word Generated!', description: 'Time to start drawing!' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast({
        title: 'Room ID Copied!',
        description: 'You can now share it with your friends.',
    });
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Clock className="h-6 w-6" />
          <span>{`0:${timeLeft.toString().padStart(2, '0')}`}</span>
        </div>
        <Badge>Round 3/10</Badge>
        <div className="hidden sm:flex items-center gap-1 rounded-lg bg-secondary pl-3">
          <span className="text-sm font-medium text-secondary-foreground">Room: {roomId}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="font-headline text-3xl sm:text-4xl font-bold tracking-widest text-center text-primary">
        {word ? (
             isDrawer ? word.split('').join(' ') : word.replace(/[a-zA-Z]/g, '_ ').trim()
           ) : (
             <span className="text-muted-foreground text-2xl">Waiting for word...</span>
           )
        }
      </div>
      
      <div className="flex items-center gap-2">
        {isDrawer ? (
          <Button onClick={handleGetWord}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Get New Word
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
             <UserCheck/> DoodleWizard is drawing
          </div>
        )}
      </div>
    </div>
  );
}
