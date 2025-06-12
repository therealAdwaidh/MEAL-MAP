// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { serverSupabase } from '@/lib/serverSupabase'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

  // Use Supabase Admin to create the user
  const { data, error } = await serverSupabase.auth.admin.createUser({
  email,
  password
})

  if (error) {
  console.error('Supabase Error:', error)
  return NextResponse.json({ error: error.message }, { status: 500 })
}
return NextResponse.json({ user: data.user })
}