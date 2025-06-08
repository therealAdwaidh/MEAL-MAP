import bcrypt from 'bcrypt'
import dbConnect from './mongodb'
import { User } from '@/model/User'

export async function registerUser(email: string, password: string) {
  await dbConnect()
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password: hashed })
  return user
}
