import type { NextConfig } from "next";

// PineLaunch pages are still built ahead of time as static pages. Since V1
// Week 2 there is also exactly one server function, /api/ai/, so the old
// `output: "export"` setting (plain files only) is gone.
const nextConfig: NextConfig = {
  // Keep /week/1/ style addresses, as before.
  trailingSlash: true,
  images: {
    // No image optimizer is needed. The site has no photos.
    unoptimized: true,
  },
  // Basic protections on every page. A fuller content policy for the studio
  // is added with the workspace in Week 4 and reviewed then.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
