import {useEffect, useState} from 'react';
import {type Database, initializeDb} from '@/stores/db.ts';
import {Provider} from 'rxdb-hooks';
import App from '@/App.tsx';
import {ThemeProvider} from '@/components/theme-provider.tsx';

export const Root = () => {
	const [db, setDb] = useState<Database>();

	useEffect(() => {
		void initializeDb().then(setDb);
	}, []);

	return (
		<Provider db={db}>
			<ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
				<App/>
			</ThemeProvider>
		</Provider>
	);
};
