'use client'

export default function PostButton() {
  const handleClick = () => {
    // Redirect to '/' and refresh the page
    window.location.href = '/'
  }

  return (
    <img
      width={80}
      height={80}
      onClick={handleClick}
      style={{
        padding: '10px 16px',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '1rem'
      }}
      src="/home.png"
      alt="Home"
    />
  )
}
