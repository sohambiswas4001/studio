"use client";

import { GameLayout } from '@/components/game/GameLayout';
import { useParams } from 'next/navigation';

export default function GamePage() {
  const params = useParams<{ roomId: string }>();
  // Here you could fetch room data based on params.roomId
  // and pass it to GameLayout
  return <GameLayout roomId={params.roomId} />;
}
