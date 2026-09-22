import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduz o pico de RAM do build (Square Cloud mata o processo por falta de memória)
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackMemoryOptimizations: true,
    staticGenerationMaxConcurrency: 2,
  },
};

export default nextConfig;
