/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/dashboard/reviews", destination: "/reviews", permanent: false },
      { source: "/dashboard/settings", destination: "/settings", permanent: false },
    ];
  },
};

export default nextConfig;
