import type { NextConfig } from "next";

// PineLaunch v1 is a fully static site: no server, no database, no API routes.
// `output: "export"` writes plain HTML/CSS/JS into /out so it can be hosted
// for free on Vercel, Netlify or GitHub Pages.
const nextConfig: NextConfig = {
  output: "export",
  // Emit /week/1/index.html instead of /week/1.html so plain static hosts
  // serve nested pages without extra rewrite rules.
  trailingSlash: true,
  images: {
    // The default image optimizer needs a server. v1 has no images anyway.
    unoptimized: true,
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
