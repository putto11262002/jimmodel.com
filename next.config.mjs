import { withSentryConfig } from "@sentry/nextjs";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/calendar" },
      { source: "/showcases", destination: "/showcases/1" },

      {
        source: "/models",
        destination: "/models/all/all/1",
      },
      {
        source: "/models/profile/:id",
        destination: "/models/profile/:id/book",
      },
      {
        source: "/models/:category",
        destination: "/models/:category/all/1",
      },
      {
        source: "/models/:category/:bookingStatus",
        destination: "/models/:category/:bookingStatus/1",
      },
      {
        source: "/admin/website",
        destination: "/admin/website/web-assets",
      },
    ];
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

      {
        source: "/admin/jobs/:id/update",
        destination: "/admin/jobs/:id/update/general",
        permanent: false,
      },

      {
        source: "/application",
        destination: "/application/general",
        permanent: false,
      },
      // {
      //   source: "/admin/users/:id/update",
      //   destination: "/admin/users/:id/update/roles",
      //   permanent: false,
      // },
    ];
  },
  experimental: {
    esmExternals: "loose",
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              "./node_modules/.pnpm/pdfkit@*/node_modules/pdfkit/js/data/Helvetica.afm"
            ),
            to: path.resolve(".next/server/vendor-chunks/data/Helvetica.afm"),
          },

          {
            from: path.resolve(
              "./node_modules/.pnpm/pdfkit@*/node_modules/pdfkit/js/data/Helvetica.afm"
            ),
            to: path.resolve(
              ".next/standalone/.next/server/chunks/data/Helvetica.afm"
            ),
          },
          {
            from: path.resolve("node_modules/geoip-lite/data"),
            to: path.resolve(".next/server/app/data/"),
          },

          {
            from: path.resolve("node_modules/geoip-lite/data"),
            to: path.resolve(".next/server/app/admin/data/"),
          },
          {
            from: path.resolve("node_modules/geoip-lite/data"),
            to: path.resolve(".next/server/data/"),
          },
        ],
      })
    );
    return config;
  },
};
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
