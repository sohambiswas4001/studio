import { GameLayout } from '@/components/game/GameLayout';

export default function GamePage({ params }: { params: { roomId: string } }) {
  // Here you could fetch room data based on params.roomId
  // and pass it to GameLayout
  return <GameLayout roomId={params.roomId} />;
}
