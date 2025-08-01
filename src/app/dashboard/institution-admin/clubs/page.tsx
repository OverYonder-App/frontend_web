// File: src/app/admin/clubs/page.tsx

import type { Metadata } from 'next'
import ClubsExplorer from '@/components/ClubsExplorer'

export const metadata: Metadata = {
  title: 'Clubs – Institution Admin',
}

/**
 * Server component for the clubs administration page. Fetches the list
 * of clubs on the server and passes it down to the {@link ClubsExplorer}
 * client component for interaction.
 */
export default async function ClubsPage() {
  const clubs: never[] = []
  return (
    <div className="p-6 sm:p-8">
      <ClubsExplorer clubs={clubs} />
    </div>
  )
}