/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

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
      {
        source: "/models/profile/:id",
        destination: "/models/profile/:id/book",
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

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve("node_modules/pdfkit/js/data/Helvetica.afm"),
            to: path.resolve(".next/server/vendor-chunks/data"),
          },
        ],
      }),
    );
    return config;
  },
};

export default nextConfig;
