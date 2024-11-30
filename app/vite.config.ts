import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import { VitePWA as vitePwa } from 'vite-plugin-pwa'
import Info from 'unplugin-info/vite'
import { pwaConfig } from './pwa.config'

export default defineConfig({
	plugins: [
		ViteYaml(),
		react(),
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
