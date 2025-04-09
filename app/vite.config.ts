import path from "node:path";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import react from "@vitejs/plugin-react-swc";
import Info from "unplugin-info/vite";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA as vitePwa } from "vite-plugin-pwa";
import { pwaConfig } from "./pwa.config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		ViteYaml(),
		react(),
		tailwindcss(),
		vitePwa(pwaConfig),
		mkcert(),
		Info({
			prefix: "@build",
			package: {
				contributors: true,
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
