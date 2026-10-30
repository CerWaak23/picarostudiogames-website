/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  /* Powder & Sail pasó a llamarse Mar Bravo. El enlace viejo no debe caer en un
     404: redirige permanente al nuevo. */
  async redirects() {
    return [
      {
        source: "/games/powder-and-sail",
        destination: "/games/mar-bravo",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
