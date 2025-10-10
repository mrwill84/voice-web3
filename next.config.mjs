/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${process.env.API_TARGET_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
