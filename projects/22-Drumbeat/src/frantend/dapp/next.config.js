/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storageapi.fleek.co', 'ipfs.fleek.co', 'storage.fleek.zone'],
  },
}

module.exports = nextConfig
