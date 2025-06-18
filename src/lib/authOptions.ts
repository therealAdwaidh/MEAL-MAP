// src/lib/authOptions.ts
import { createClient } from '@supabase/supabase-js'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import type { NextAuthOptions } from 'next-auth'
import { prisma } from '@/lib/prisma'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {}
        if (!email || !password) return null

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error || !data.user) return null

        // fetch user profile from Prisma
        const dbUser = await prisma.user.findUnique({ where: { email } })

        return {
          id: data.user.id,
          email: data.user.email,
          image: dbUser?.image || 'https://i.pravatar.cc/150'
        }
      }
    })
  ],

  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  }),

  session: { strategy: 'jwt' },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.image = token.image
      return session
    },
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id
          token.image = (user as any).image // 👈 Fixes the type error
        }
        return token
      }

  },

  pages: {
    signIn: '/auth'
  },

  debug: process.env.NODE_ENV === 'development'
}
