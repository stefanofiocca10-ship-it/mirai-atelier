/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Utile in simulazione/offline e hosting Aruba senza CDN immagini
  poweredByHeader: false,
};

export default nextConfig;
