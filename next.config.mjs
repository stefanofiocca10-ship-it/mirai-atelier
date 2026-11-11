/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
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
