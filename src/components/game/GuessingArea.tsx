"use client";

import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

const MOCK_MESSAGES = [
  { player: 'Sketchy', text: 'joined the game.', type: 'event' },
  { player: 'Artful Dodger', text: 'joined the game.', type: 'event' },
  { player: 'DoodleWizard', text: 'is drawing now.', type: 'event' },
  { player: 'Artful Dodger', text: 'Is it a cat?', type: 'guess' },
  { player: 'Sketchy', text: 'Looks like a dog to me', type: 'guess' },
  { player: 'Pixel Picasso', text: 'A house?', type: 'guess' },
  { player: 'Artful Dodger', text: 'A table!', type: 'guess' },
  { player: 'Sketchy', text: 'Chair!', type: 'guess' },
  { player: 'Pixel Picasso', text: 'Bed', type: 'correct' },
];

export function GuessingArea() {
    const [guess, setGuess] = useState("");
  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <MessageSquare />
          Guessing Box
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4">
            {MOCK_MESSAGES.map((msg, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>{msg.player.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-bold">{msg.player}</span>
                  {msg.type === 'guess' && `: ${msg.text}`}
                  {msg.type === 'event' && <span className="text-muted-foreground italic"> {msg.text}</span>}
                  {msg.type === 'correct' && 
                    <span className="font-bold text-primary">{` guessed the word! (+80 pts)`}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); setGuess(''); }}>
          <Input 
            placeholder="Type your guess..." 
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={!guess.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
