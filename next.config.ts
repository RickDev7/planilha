import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto (há outro lockfile no diretório do usuário).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
