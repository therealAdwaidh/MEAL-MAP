// 4. /app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongodb'
import { User } from '@/model/User'
import bcrypt from 'bcrypt'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        await dbConnect()
        const user = await User.findOne({ email: credentials.email })
        if (!user) return null
        const match = await bcrypt.compare(credentials.password, user.password)
        return match ? { id: user._id.toString(), email: user.email } : null
      },
    }),
  ],
  session: {
    strategy: 'jwt', // ✅ this will now be type-checked correctly
  },
  pages: {
    signIn: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
}


