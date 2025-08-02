'use client';
import ClubDetail from '@/components/ClubDetail';
import { useParams } from 'next/navigation';

interface Params {
  params: { id: string };
}

export default function ClubDetailPage({ params }: Params) {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="p-6 sm:p-8">
      <ClubDetail clubId={id} />
    </div>
  );
}
