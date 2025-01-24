import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	distDir: "build",
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true, // Ignore TypeScript errors during builds
	},
};

export default nextConfig;
