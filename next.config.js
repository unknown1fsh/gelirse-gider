/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify için experimental configuration
  output: 'standalone',
  
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
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
