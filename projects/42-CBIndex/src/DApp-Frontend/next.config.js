/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['assets.cbindex.finance'],
  },
  async redirects() {
    return [
      {
        permanent: false,
        source: '/',
        destination: '/discover',
      },
      // Have integrations as the default partners page
      {
        permanent: false,
        source: '/discover/',
        destination: '/discover',
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/discover',
        destination: '/discover/page',
      },
    ]
  },
}
