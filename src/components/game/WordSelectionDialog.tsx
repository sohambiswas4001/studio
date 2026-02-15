"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface WordSelectionDialogProps {
  isOpen: boolean;
  words: string[];
  onSelectWord: (word: string) => void;
}

export function WordSelectionDialog({
  isOpen,
  words,
  onSelectWord,
}: WordSelectionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb />
            Choose a word to draw
          </DialogTitle>
          <DialogDescription>
            You will have 90 seconds to draw the word you select.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 pt-4">
          {words.map((word) => (
            <Button
              key={word}
              onClick={() => onSelectWord(word)}
              className="w-full text-lg h-12"
              size="lg"
            >
              {word}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
