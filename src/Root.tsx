import {useEffect, useState} from 'react';
import {type Database, initializeDb} from '@/stores/db.ts';
import {Provider} from 'rxdb-hooks';
import {ThemeProvider} from '@/components/theme-provider.tsx';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';
import Layout from '@/routes/Layout.tsx';

const router = createBrowserRouter(createRoutesFromElements(
	<Route element={<Layout/>}>
		<Route path='/' lazy={async () => import('@/routes/Insights.tsx')}/>
		<Route path='/settings' lazy={async () => import('@/routes/Settings.tsx')}/>
	</Route>,
));

export default function Root() {
	const [db, setDb] = useState<Database>();

	useEffect(() => {
		void initializeDb()
			.then(setDb);
	}, []);

	return (
		<Provider db={db}>
			<ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
				<RouterProvider router={router}/>
			</ThemeProvider>
		</Provider>
	);
}
