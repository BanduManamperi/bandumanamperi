import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the LAN load the Next.js dev server (CSS/JS).
  allowedDevOrigins: [
    "192.168.2.240",
    "127.0.0.1",
    "*.trycloudflare.com",
  ],
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
