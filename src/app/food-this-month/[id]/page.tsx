import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import './FoodItemPage.css';
import HomeButton from '@/components/HomeButton';
import BackButton from '@/components/BackButton';


export default async function FoodItemPage({ params }: { params: { id: string } }) {
  console.log('✅ Dynamic route hit with ID:', params.id);

  const item = await prisma.food_items.findUnique({
    where: { id: params.id },
  });

  if (!item) return notFound();

  return (
    <main className="food-detail-container">
      <HomeButton />
      <h1 className="main-title">{item.title ?? 'Untitled'}</h1>

      <div className="food-detail-content">
        <div className="food-image-wrapper">
          <img
            src={item.image ?? '/fallback-image.png'}
            alt={item.title ?? 'Food Item'}
            className="food-image"
          />
        </div>
        <div className="food-detail-info">
          <p><strong>Description:</strong> {item.description ?? 'No description provided.'}</p>
          <p><strong>Price:</strong> ${item.rate.toFixed(2)}</p>
          <p><strong>Available Quantity:</strong> {item.quantity}</p>
          <p><strong>Posted:</strong> {new Date(item.createdAt).toLocaleString()}</p>
          <BackButton id={item.id} />


        </div>
      </div>
    </main>
  );
}
