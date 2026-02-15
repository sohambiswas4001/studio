"use client";

import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

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
            {/* Messages will be displayed here */}
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
