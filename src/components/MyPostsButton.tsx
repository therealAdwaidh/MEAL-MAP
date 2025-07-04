// components/MyPostsButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MyPostsButton() {
  const router = useRouter()

  return (
    <Image
      src="/list.png"           // any icon you like
      alt="My posts"
      width={50}
      height={50}
      style={{ cursor: 'pointer', padding: '10px 0px 0px 0px' }}
      onClick={() => router.push('/my-foods')}
    />
  )
}
