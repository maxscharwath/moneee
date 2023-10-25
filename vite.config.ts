
import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import {VitePWA as vitePwa, type VitePWAOptions} from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

const pwaConfig = {
	registerType: 'autoUpdate',
	manifest: {
		name: 'Moneee',
		short_name: 'Moneee',
		description: 'An innovative budget app, that helps you to save money',
		theme_color: '#000000',
		start_url: '/',
		display: 'standalone',
		orientation: 'portrait',
		icons: [
			{
				src: 'pwa-64x64.png',
				sizes: '64x64',
				type: 'image/png',
			},
			{
				src: 'pwa-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: 'maskable-icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	},
} satisfies Partial<VitePWAOptions>;

export default defineConfig({
	plugins: [react(), vitePwa(pwaConfig), mkcert()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		https: true,
	},
});
