"use client";

import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Message {
    id: string;
    type: 'system' | 'guess' | 'correct';
    text: string;
    sender?: string;
}

interface GuessingAreaProps {
    messages: Message[];
}

export function GuessingArea({ messages }: GuessingAreaProps) {
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
            {messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex items-start gap-3 text-sm",
                msg.type === 'system' && 'justify-center'
              )}>
                {msg.type !== 'system' && (
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback>{msg.sender?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                )}
                 <div className={cn(
                    "rounded-lg px-3 py-2",
                    msg.type === 'guess' && 'bg-muted',
                    msg.type === 'system' && 'bg-secondary text-secondary-foreground text-xs italic',
                    msg.type === 'correct' && 'bg-green-100 dark:bg-green-900 font-semibold'
                 )}>
                    {msg.type !== 'system' && msg.sender && <p className="font-bold">{msg.sender}</p>}
                    <p>{msg.text}</p>
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
