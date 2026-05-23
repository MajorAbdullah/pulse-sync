import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next.js doesn't get confused by an unrelated
  // lockfile higher up the filesystem.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
