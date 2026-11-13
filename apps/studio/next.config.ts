import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bandumanamperi/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.bunnycdn.com",
      },
      {
        protocol: "https",
        hostname: "djqvnmqvmstckuafclrq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
