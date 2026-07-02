import { Card } from "@/components/ui/card";
import { fetchUsers, type UserWithInstitution } from "@/features/users/api";
import FriendActions from "@/features/friends/components/FriendActions";
import Link from "next/link";

export default async function UsersPage() {
  const users = await fetchUsers();
  const institutionName = users[0]?.institutions?.institution_name;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-lg text-black-500">Member of {institutionName}</h1>
      {users.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No users yet...</p>
      ) : (
        users.map((user: UserWithInstitution) => (
          <Card
            key={user.user_id}
            className="flex flex-row items-center gap-3 p-4 hover:bg-gray-50"
          >
            <Link
              href={`/users/${user.user_id}`}
              className="block min-w-0 flex-1"
            >
              <h3 className="truncate font-semibold">{user.email}</h3>
              {user.institutions?.institution_name ? (
                <p className="text-sm text-gray-500">
                  Member of {user.institutions.institution_name}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No institution yet...</p>
              )}
            </Link>
            <FriendActions userId={user.user_id} showIncoming={false} />
          </Card>
        ))
      )}
    </main>
  );
}
