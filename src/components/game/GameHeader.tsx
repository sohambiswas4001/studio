"use client";

import { getNewWordAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, buttonVariants } from '../ui/button';
import { Clock, UserCheck, Copy, Trash2 } from 'lucide-react';
import { WordSelectionDialog } from './WordSelectionDialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface GameHeaderProps {
    isDrawer: boolean;
    roomId: string;
    playerName: string;
}

export function GameHeader({ isDrawer, roomId, playerName }: GameHeaderProps) {
  const [selectedWord, setSelectedWord] = useState('');
  const [displayedWord, setDisplayedWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const [wordChoices, setWordChoices] = useState<string[]>([]);
  const [isSelectingWord, setIsSelectingWord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerName, setDrawerName] = useState('DoodleWizard');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();


  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && selectedWord) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, selectedWord]);

  // Letter reveal effect
  useEffect(() => {
    if (!isDrawer && selectedWord) {
      const revealInterval = setInterval(() => {
        setDisplayedWord(currentDisplayedWord => {
          const underscoreIndices: number[] = [];
          currentDisplayedWord.split('').forEach((char, index) => {
            if (char === '_') {
              underscoreIndices.push(index);
            }
          });

          if (underscoreIndices.length <= 2) { // Stop when 2 or fewer letters are left hidden
            clearInterval(revealInterval);
            return currentDisplayedWord;
          }
          
          const randomIndexToReveal = underscoreIndices[Math.floor(Math.random() * underscoreIndices.length)];
          const newDisplayedWord = currentDisplayedWord.split('');
          newDisplayedWord[randomIndexToReveal] = selectedWord[randomIndexToReveal];
          return newDisplayedWord.join('');
        });
      }, 15000); // Reveal a letter every 15 seconds

      return () => clearInterval(revealInterval);
    }
  }, [selectedWord, isDrawer]);

  const handleGetWords = useCallback(async () => {
    setIsLoading(true);
    // In a real app, these would come from game state
    const input = {
      drawnWords: ['house', 'cat'],
      playerSkillLevel: 'intermediate' as const
    };
    const result = await getNewWordAction(input);
    if (result.success && result.words) {
      setWordChoices(result.words);
      setIsSelectingWord(true);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error || 'Could not fetch words.' });
    }
    setIsLoading(false);
  }, [toast]);

  // Automatically fetch words for the drawer
  useEffect(() => {
    if (isDrawer && !selectedWord && !isSelectingWord && !isLoading) {
      handleGetWords();
    }
  }, [isDrawer, selectedWord, isSelectingWord, isLoading, handleGetWords]);


  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
    setDisplayedWord(word.replace(/[a-zA-Z]/g, '_'));
    setIsSelectingWord(false);
    setDrawerName(playerName);
    setTimeLeft(90); 
    toast({ title: 'You are drawing!', description: `The word is "${word}". Good luck!` });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast({
        title: 'Room ID Copied!',
        description: 'You can now share it with your friends.',
    });
  };

  const handleDeleteRoom = () => {
    // In a real app, this would involve a server call.
    // For now, we just redirect to the home page.
    setIsDeleteDialogOpen(false);
    router.push('/');
    toast({
        variant: 'default',
        title: 'Room Deleted',
        description: `The room ${roomId} has been deleted.`,
    });
  };

  const wordToDisplay = useMemo(() => {
    if (!selectedWord) {
        return <span className="text-muted-foreground text-2xl">{'\u00A0'}</span>;
    }
    const word = isDrawer ? selectedWord : displayedWord;
    return word.split('').join(' ');
  }, [selectedWord, isDrawer, displayedWord]);

  return (
    <>
      <WordSelectionDialog
        isOpen={isSelectingWord}
        words={wordChoices}
        onSelectWord={handleSelectWord}
      />
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room
              and remove all players.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              className={buttonVariants({ variant: "destructive" })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Clock className="h-6 w-6" />
            <span>{`0:${timeLeft.toString().padStart(2, '0')}`}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 rounded-lg bg-secondary pl-3">
            <span className="text-sm font-medium text-secondary-foreground">Room: {roomId}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4" />
            </Button>
            {isDrawer && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
          </div>
        </div>
        
        <div className="font-headline text-3xl sm:text-4xl font-bold tracking-widest text-center text-primary min-h-[48px] flex items-center justify-center">
          {wordToDisplay}
        </div>
        
        <div className="flex items-center gap-2 min-w-[170px] justify-end">
          {!isDrawer && (
            <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
               <UserCheck/> {drawerName} is drawing
            </div>
          )}
        </div>
      </div>
    </>
  );
}
