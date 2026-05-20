/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'fmapi.myfurnituremecca.com',
  //       hostname: 'https://devapi.myfurnituremecca.com/',
  //       pathname: '/**', // allow all paths from this host
  //     },
  //   ],
  // },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fmapi.myfurnituremecca.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'devapi.myfurnituremecca.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
