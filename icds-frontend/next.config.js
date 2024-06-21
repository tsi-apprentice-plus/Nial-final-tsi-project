/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ukic/react"],
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
