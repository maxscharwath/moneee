import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'@': path.resolve(__dirname, './src'),
		},
	},
});

