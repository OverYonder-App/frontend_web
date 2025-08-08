import type { EventAttendee } from "../api.server";

export default function AttendeeList({ attendees }: { attendees: EventAttendee[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Attendees</h2>
      {attendees.length === 0 ? (
        <p className="text-sm text-gray-500">No attendees yet.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {attendees.map((a) => {
            const fullName = [a.users?.first_name, a.users?.last_name]
              .filter(Boolean)
              .join(" ");
            const name = fullName || a.users?.username || a.user_id;
            return <li key={a.user_id}>{name}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
