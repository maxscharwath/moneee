import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {ThemeProvider} from '@/components/theme-provider.tsx';
import {RecoilRoot} from 'recoil';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RecoilRoot>
			<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
				<App />
			</ThemeProvider>
		</RecoilRoot>
	</React.StrictMode>,
);
