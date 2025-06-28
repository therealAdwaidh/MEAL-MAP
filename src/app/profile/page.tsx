import UserProfile from "@/components/UserProfile"
import { getServerSession } from "next-auth" // if using NextAuth

export default async function ProfilePage() {
  const session = await getServerSession()
  const email = session?.user?.email

  if (!email) return <p>Please login first.</p>

  return <UserProfile email={email} />
}
