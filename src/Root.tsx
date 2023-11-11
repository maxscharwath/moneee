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
		<Route path='/settings'>
			<Route path='' lazy={async () => import('@/routes/settings/Settings.tsx')}/>
			<Route path='currency' lazy={async () => import('@/routes/settings/Currency.tsx')}/>
			<Route path='language' lazy={async () => import('@/routes/settings/Language.tsx')}/>
			<Route path='categories' lazy={async () => import('@/routes/settings/Categories.tsx')}/>
		</Route>
	</Route>,
));

const useDb = () => {
	const [db, setDb] = useState<Database>();

	useEffect(() => {
		void initializeDb()
			.then(setDb);
	}, []);

	return db;
};

export default function Root() {
	const db = useDb();

	return (
		<Provider db={db}>
			<ThemeProvider defaultTheme='system'>
				<RouterProvider router={router}/>
			</ThemeProvider>
		</Provider>
	);
}
