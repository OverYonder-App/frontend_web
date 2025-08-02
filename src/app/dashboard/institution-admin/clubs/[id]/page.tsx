import ClubDetail from '@/components/ClubDetail';

interface Params {
  params: { id: string };
}

export default function ClubDetailPage({ params }: Params) {
  return (
    <div className="p-6 sm:p-8">
      <ClubDetail clubId={params.id} />
    </div>
  );
}
