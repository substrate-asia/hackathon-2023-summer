/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arweave.net",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: process.env.CI === "false",
  },
  typescript: {
    ignoreBuildErrors: process.env.CI === "false",
  },
};

module.exports = nextConfig;
