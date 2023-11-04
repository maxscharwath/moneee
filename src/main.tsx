import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@/i18n.ts';
import '@/stores/db.ts';
import Root from '@/Root.tsx';

ReactDOM.createRoot(document.getElementById('root')!)
	.render(
		<React.StrictMode>
			<Root/>
		</React.StrictMode>,
	);
