import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@/i18n';
import '@/stores/db';
import Root from '@/Root';

ReactDOM.createRoot(document.getElementById('root')!)
	.render(
		<React.StrictMode>
			<Root/>
		</React.StrictMode>,
	);
