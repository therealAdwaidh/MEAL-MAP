
"use client"
import { useState, FormEvent } from 'react'

interface FoodItem {
  title: string
  description: string
  image: string
  rate: number
  quantity: number
}

export default function PostPage() {
  const [form, setForm] = useState<Omit<FoodItem, 'rate' | 'quantity'>>({
    title: '',
    description: '',
    image: ''
  })
  const [rate, setRate] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [items, setItems] = useState<FoodItem[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newItem: FoodItem = {
      title: form.title,
      description: form.description,
      image: form.image,
      rate,
      quantity
    }
    setItems([newItem, ...items])
    // reset form
    setForm({ title: '', description: '', image: '' })
    setRate(0)
    setQuantity(1)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2">
        {/* Form Card */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold mb-4">Add New Food Item</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Food Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="e.g. Spicy Ramen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border rounded p-2 h-24"
                placeholder="A brief description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min={1}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Add Item
            </button>
          </form>
        </section>

        {/* Preview/List Card */}
        <section className="">
          <h2 className="text-xl font-semibold mb-4">Food Items</h2>
          <div className="space-y-6">
            {items.length === 0 ? (
              <p className="text-gray-500">No items added yet.</p>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow p-4 grid lg:grid-cols-3 gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-lg lg:col-span-1"
                  />
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="font-medium">Rate: ${item.rate.toFixed(2)}</span>
                      <span className="font-medium">Quantity: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}