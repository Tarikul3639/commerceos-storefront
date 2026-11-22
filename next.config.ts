import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.68.113"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },

      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
}

export default nextConfig
