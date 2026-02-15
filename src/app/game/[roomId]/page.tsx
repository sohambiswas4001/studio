import { GameLayout } from '@/components/game/GameLayout';
import { Suspense } from 'react';

function GamePageContent({ params }: { params: { roomId: string } }) {
  return <GameLayout roomId={params.roomId} />;
}

export default function GamePage({ params }: { params: { roomId: string } }) {
  // Here you could fetch room data based on params.roomId
  // and pass it to GameLayout
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GamePageContent params={params} />
    </Suspense>
  );
}
