import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RecoilRoot} from 'recoil';
import {ThemeProvider} from '@/components/theme-provider.tsx';
import App from '@/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!)
	.render(
		<React.StrictMode>
			<RecoilRoot>
				<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
					<App/>
				</ThemeProvider>
			</RecoilRoot>
		</React.StrictMode>,
	);
