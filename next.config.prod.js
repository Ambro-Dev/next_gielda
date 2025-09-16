/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Disable static optimization for pages that make API calls
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.mapbox.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
    domains: ["uploadthing.com"],
    // Optimize images for production
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Webpack configuration
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Disable static generation for specific routes
  async rewrites() {
    return [
      {
        source: '/report',
        destination: '/report',
        has: [
          {
            type: 'query',
            key: 'dynamic',
            value: 'true',
          },
        ],
      },
    ];
  },
  
  // Environment variables validation
  // env: {
  //   CUSTOM_KEY: process.env.CUSTOM_KEY,
  // },
  
  // Experimental features for production
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    // Ensure all webpack bundles are included in standalone build
    outputFileTracingRoot: undefined,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  
  // Build optimizations
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors for production build
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
