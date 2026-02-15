import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const MOCK_PLAYERS = [
  { name: 'DoodleWizard', score: 120, isDrawing: true, avatarSeed: '1' },
  { name: 'Artful Dodger', score: 95, isDrawing: false, avatarSeed: '2' },
  { name: 'Sketchy', score: 80, isDrawing: false, avatarSeed: '3' },
  { name: 'Pixel Picasso', score: 110, isDrawing: false, avatarSeed: '4' },
];

export function Scoreboard() {
  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Award />
          Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PLAYERS.sort((a,b) => b.score - a.score).map((player, index) => (
              <TableRow key={player.name} className={player.isDrawing ? 'bg-accent/20' : ''}>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://picsum.photos/seed/${player.avatarSeed}/40/40`} alt={player.name} data-ai-hint="person face" />
                    <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{player.name}</span>
                  {player.isDrawing && <Badge variant="outline" className="ml-auto !h-5 !px-1.5 !py-0">Drawing</Badge>}
                </TableCell>
                <TableCell className="text-right font-semibold">{player.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
