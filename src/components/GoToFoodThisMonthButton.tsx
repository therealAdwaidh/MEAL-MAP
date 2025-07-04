'use client';

import { useRouter } from 'next/navigation';

export function GoToFoodThisMonthButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/food-this-month');
  };

  return (

    <div className="">
        <img width={80} height={80} onClick={handleClick}
      className="px-4 py-2 rounded-xl transition" src="/cart.png" alt="" />
        
    </div>
    
  );
}

export default GoToFoodThisMonthButton;
