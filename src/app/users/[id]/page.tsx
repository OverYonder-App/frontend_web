import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchUser, type UserWithInstitution } from '@/features/users/api'
import { fetchEvents, type EventRecord } from '@/features/events/api.server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Profile',
  description: 'User details and associated events',
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let userData
  try {
    userData = await fetchUser(id)
  } catch {
    notFound()
  }
  const user = userData?.user as UserWithInstitution
  if (!user) {
    notFound()
  }

  let createdEvents: EventRecord[] = []
  let participatedEvents: EventRecord[] = []
  try {
    [{ events: createdEvents }, { events: participatedEvents }] = await Promise.all([
      fetchEvents({ creatorId: id }),
      fetchEvents({ participantId: id }),
    ])
  } catch {
    createdEvents = []
    participatedEvents = []
  }

  const eventsMap = new Map<string, EventRecord>()
  for (const e of [...createdEvents, ...participatedEvents]) {
    eventsMap.set(e.event_id, e)
  }
  const events = Array.from(eventsMap.values())

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')
  const institutionName = user.institutions?.institution_name

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        {user.avatar_url && (
          <Image
            src={user.avatar_url}
            alt={fullName}
            priority={true}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{fullName || user.username}</h1>
          {/* {role && <p className="text-gray-600">{role}</p>} */}
          {institutionName ? (
            <p className="text-gray-600">Member of {institutionName}</p>
          ) : (
            <p className="text-sm text-gray-500">No institution yet...</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {user.email ? <p>Email: {user.email}</p> : <p>No contact info yet...</p>}
        {user.website_url && (
          <p>
            Website:{' '}
            <Link href={user.website_url} className="text-blue-500 underline" target="_blank">
              {user.website_url}
            </Link>
          </p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">About</h2>
        {user.about ? <p>{user.about}</p> : <p className="text-sm text-gray-500">No about info yet...</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Events</h2>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">No events yet...</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.event_id} className="border p-4 rounded-xl">
                <Link href={`/event/${event.event_id}`} className="hover:underline">
                  {event.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
