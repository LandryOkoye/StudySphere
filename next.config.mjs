// /** @type {import('next').NextConfig} */npm run
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add this webpack section below:
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,      // This stops the 'fs' error
        net: false,
        tls: false,
        crypto: false,  // Or use 'crypto-browserify' if needed
        stream: false,  // Or use 'stream-browserify' if needed
      };
    }
    return config;
  },
}

export default nextConfig