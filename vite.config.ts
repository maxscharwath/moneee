import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import {VitePWA as vitePwa, type VitePWAOptions} from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';
import buildInfo from 'vite-plugin-info';

const pwaConfig = {
	registerType: 'autoUpdate',
	manifest: {
		name: 'Moneee',
		short_name: 'Moneee',
		description: 'An innovative budget app, that helps you to save money',
		categories: ['finance', 'productivity', 'utilities'],
		theme_color: '#000000',
		start_url: '/',
		display: 'standalone',
		orientation: 'portrait',
		icons: [
			{
				src: 'apple-icon-180.png',
				sizes: '180x180',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: 'manifest-icon-192.maskable.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: 'manifest-icon-512.maskable.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	},
} satisfies Partial<VitePWAOptions>;

export default defineConfig({
	plugins: [react(), vitePwa(pwaConfig), mkcert(), buildInfo({prefix: '@build'})],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		https: true,
	},
});
