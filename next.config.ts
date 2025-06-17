/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/post',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig