/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      'node:fs': 'empty-module',
      'node:fs/promises': 'empty-module',
      'node:crypto': 'crypto-browserify',
      'node:stream': 'stream-browserify',
      'node:path': 'empty-module',
      fs: 'empty-module',
      net: 'empty-module',
      tls: 'empty-module',
      path: 'empty-module',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: 'empty-module',
    },
  },
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        'fs/promises': false,
        net: false,
        tls: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
      };
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
          }
        )
      );
    }
    return config;
  },
}

export default nextConfig