'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <div className="">

       <img width={50} height={50}  onClick={() => signOut({ callbackUrl: '/auth' })}
      style={{
        padding: '10px 0px 0px 0px',
        
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '1rem'
      }} src="/logout.png" alt="" />
      <p className='paragraph'>logout</p>
    </div>
   
    
  )
}
