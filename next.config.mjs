/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/calendar" }];
  },
  async redirects() {
    return [
      {
        source: "/admin/users/:id/update",
        destination: "/admin/users/:id/update/password",
        permanent: false,
      },
      {
        source: "/admin/models/:id/update",
        destination: "/admin/models/:id/update/general",
        permanent: false,
      },
    ];
  },
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      }),
    );
    return config;
  },
};

export default nextConfig;
