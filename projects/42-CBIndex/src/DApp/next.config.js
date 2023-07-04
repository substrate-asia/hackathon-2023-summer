/** @type {import('next').NextConfig} */
module.exports = {
  resolve: {
    fallback: {
      // 👇️👇️👇️ add this 👇️👇️👇️
      fs: false,
      os: false,
      path: false,
      child_process: false,
      module: false,
    },
  },

  reactStrictMode: true,
  images: {
    domains: ['assets.cbindex.finance'],
  },
  async redirects() {
    return [
      {
        permanent: false,
        source: '/',
        destination: '/discover/CopyInvesting',
      },
      // Have integrations as the default partners page
      // {
      //   permanent: false,
      //   source: '/',
      //   destination: '/discover',
      // },
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
// module.exports = function (webpackEnv) {

// }
