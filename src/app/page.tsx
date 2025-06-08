// 9. /app/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth')
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl">Welcome</h1>
      <p>{`Logged in as ${session.user?.email}`}</p>
    </main>
  )
}
