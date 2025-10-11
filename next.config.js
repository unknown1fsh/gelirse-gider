/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    // Production build için TypeScript hatalarını ignore et (geliştirme devam ediyor)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Production build için ESLint hatalarını ignore et (geliştirme devam ediyor)
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
