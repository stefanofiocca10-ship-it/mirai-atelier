/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
    outputFileTracingIncludes: {
      "/*": ["./prisma/deploy.db"],
      "/**/*": ["./prisma/deploy.db"],
    },
  },
  // Utile in simulazione/offline e hosting Aruba senza CDN immagini
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/prenota",
        destination: "/contatti",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
