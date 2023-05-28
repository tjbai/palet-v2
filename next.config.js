/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1c41fyn3bzn7n.cloudfront.net",
        port: "",
        pathname: "/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
