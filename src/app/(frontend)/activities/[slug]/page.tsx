'use client';

import { useParams } from 'next/navigation';
import ActivityPage from '@/components/ActivityPage';

export default function DynamicActivityPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <ActivityPage slug={slug} />;
}
