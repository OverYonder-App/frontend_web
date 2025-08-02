import type { Metadata } from 'next';
import ClubsExplorer from '@/components/ClubsExplorer';

export const metadata: Metadata = {
  title: 'Clubs – Institution Admin',
};

export default function ClubsPage() {
  return (
    <div className="p-6 sm:p-8">
      <ClubsExplorer />
    </div>
  );
}
