import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RecoilRoot} from 'recoil';
import {ThemeProvider} from '@/components/theme-provider.tsx';
import AddTransactionModal from '@/components/AddTransactionModal.tsx';

ReactDOM.createRoot(document.getElementById('root')!)
	.render(
		<React.StrictMode>
			<RecoilRoot>
				<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
					<AddTransactionModal/>
				</ThemeProvider>
			</RecoilRoot>
		</React.StrictMode>,
	);
