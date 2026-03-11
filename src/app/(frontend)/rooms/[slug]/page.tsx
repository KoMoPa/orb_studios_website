'use client';

import { useParams } from 'next/navigation';
import RoomPage from '@/components/RoomPage';

export default function DynamicRoomPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <RoomPage slug={slug} />;
}
