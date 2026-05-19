/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
   images: {
    domains: ["your-pull-zone-name.b-cdn.net"],
  },
};

module.exports = nextConfig;
