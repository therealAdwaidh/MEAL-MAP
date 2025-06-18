'use client'

import { useSession } from 'next-auth/react'
import { useUserImage } from '@/context/UserImageContext'
import { clientSupabase } from '@/lib/clientSupabase'
import { useState } from 'react'

export default function ProfileSection() {
  const { data: session } = useSession()
  const { setImage } = useUserImage()

  const userImage = session?.user?.image || '/image4.webp'
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [tempImage, setTempImage] = useState<File | null>(null)
  const [editing, setEditing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
      setTempImage(file)
      setEditing(true)
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = async () => {
  if (!tempImage || !session?.user.email) return

  // ✅ Add a folder + extension to avoid 400 error
  const filename = `profile/${session.user.email}-${Date.now()}.png`

  const { data, error } = await clientSupabase
    .storage
    .from('profilepics')
    .upload(filename, tempImage, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Upload error:', error)
    return
  }

  const { data: publicURLData } = clientSupabase
    .storage
    .from('profilepics')
    .getPublicUrl(filename)

  const imageUrl = publicURLData.publicUrl

  // ✅ Save to Prisma via your API
  await fetch('/api/update-profile-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: session.user.email,
      image: imageUrl,
    }),
  })

  setImage(imageUrl)
  setEditing(false)
  setPreviewImage(null)
  setTempImage(null)
}


  const handleCancel = () => {
    setEditing(false)
    setPreviewImage(null)
    setTempImage(null)
  }

  const displayImage = previewImage || session?.user?.image || '/image4.webp'

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>Profile</h2>
      <img
        src={editing && previewImage ? previewImage : displayImage}
        alt="Profile"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '3px solid #aaa',
          marginBottom: '1rem'
        }}
      />

      {!editing ? (
        <>
          <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
            <span style={{ background: '#3182ce', color: 'white', padding: '8px 16px', borderRadius: '6px' }}>
              Edit Profile Image
            </span>
          </label>
          <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </>
      ) : (
        <div>
          <button onClick={handleConfirm} style={{ marginRight: '1rem', backgroundColor: 'green', color: 'white' }}>Confirm</button>
          <button onClick={handleCancel} style={{ backgroundColor: '#e53e3e', color: 'white' }}>Cancel</button>
        </div>
      )}
    </div>
  )
}
