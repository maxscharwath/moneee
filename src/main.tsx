import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RecoilRoot} from 'recoil';
import '@/i18n.ts';
import '@/stores/db.ts';
import {Root} from '@/Root.tsx';

ReactDOM.createRoot(document.getElementById('root')!)
	.render(
		<React.StrictMode>
			<RecoilRoot>
				<Root />
			</RecoilRoot>
		</React.StrictMode>,
	);
