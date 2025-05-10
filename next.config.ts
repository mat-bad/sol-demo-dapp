import type { NextConfig } from "next";

const isProd = false;//process.env.NODE_ENV === 'production';


const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/sol-demo-dapp' : '',
  assetPrefix: isProd ? '/sol-demo-dapp/' : '',
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
};

export default nextConfig;
