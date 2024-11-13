import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import buildInfo from 'vite-plugin-info'
import mkcert from 'vite-plugin-mkcert'
import { type VitePWAOptions, VitePWA as vitePwa } from 'vite-plugin-pwa'

const pwaConfig = {
	registerType: "prompt",
	manifest: {
		name: "Moneee",
		short_name: "Moneee",
		description: "An innovative budget app, that helps you to save money",
		categories: ["finance", "productivity", "utilities"],
		theme_color: "#000000",
		start_url: "/",
		display: "standalone",
		orientation: "portrait",
		icons: [
			{
				src: "apple-icon-180.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "manifest-icon-192.maskable.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "manifest-icon-512.maskable.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	},
	minify: true,
	workbox: {
		navigateFallbackDenylist: [/^\/api/],
	},
} satisfies Partial<VitePWAOptions>;

export default defineConfig({
	plugins: [
		react(),
		vitePwa(pwaConfig),
		mkcert(),
		buildInfo({ prefix: "@build" }),
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
