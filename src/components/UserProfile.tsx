"use client"

import { useState, useEffect } from "react"

export default function UserProfile({ email }: { email: string }) {
  const [user, setUser] = useState<{ name: string | null; bio: string | null } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", bio: "" })

  useEffect(() => {
    fetch(`/api/get-user?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setFormData({ name: data.name || "", bio: data.bio || "" })
      })
  }, [email])

  const handleSave = async () => {
    const res = await fetch('/api/update-user', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: formData.name, bio: formData.bio })
    })
    const updated = await res.json()
    setUser(updated)
    setIsEditing(false)
  }

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">User Profile</h2>
      <p><strong>Name:</strong> {user?.name || "Not set"}</p>
      <p><strong>Bio:</strong> {user?.bio || "Not set"}</p>
      <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Edit
      </button>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
