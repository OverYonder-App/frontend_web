import { Card } from '@/components/ui/card'
import { fetchUsers, type UserRecord } from '@/features/users/api'

export default async function UsersPage() {
  const users = await fetchUsers()

  return (
    <main className="p-6 space-y-4">
      {users.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No users yet...</p>
      ) : (
        users.map((user: UserRecord) => (
          <Card key={user.id} className="p-4">
            <h3 className="font-semibold">{user.email}</h3>
            <p className="text-sm text-gray-500">{user.role_type}</p>
          </Card>
        ))
      )}
    </main>
  )
}
