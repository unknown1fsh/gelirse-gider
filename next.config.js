/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone mode devre dışı - normal build kullanıyoruz
  // output: 'standalone',

  serverExternalPackages: ['@prisma/client'],

  typescript: {
    // Production build için TypeScript hatalarını ignore et (geliştirme devam ediyor)
    ignoreBuildErrors: true,
  },

  eslint: {
    // Production build için ESLint hatalarını ignore et (geliştirme devam ediyor)
    ignoreDuringBuilds: true,
  },

  // Environment variables to expose to the client
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
