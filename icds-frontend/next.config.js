/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ukic/react"],
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
