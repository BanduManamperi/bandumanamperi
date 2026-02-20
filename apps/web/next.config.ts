import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@bandumanamperi/ui",
    "@bandumanamperi/supabase",
    "@bandumanamperi/types",
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.bunnycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'djqvnmqvmstckuafclrq.supabase.co',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
