import { useEffect, useState } from "react";
import { type Database, initializeDb } from "@/stores/db";
import { Provider } from "rxdb-hooks";
import { ThemeProvider } from "@/components/theme-provider";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Layout from "@/routes/Layout";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<Layout />}>
			<Route path="/" lazy={async () => import("@/routes/Insights")} />
			<Route path="/settings">
				<Route
					path=""
					lazy={async () => import("@/routes/settings/Settings")}
				/>
				<Route
					path="currency"
					lazy={async () => import("@/routes/settings/Currency")}
				/>
				<Route
					path="language"
					lazy={async () => import("@/routes/settings/Language")}
				/>
				<Route
					path="categories"
					lazy={async () => import("@/routes/settings/Categories")}
				/>
				<Route
					path="recurrences"
					lazy={async () => import("@/routes/settings/Recurrences")}
				/>
				<Route
					path="synchronisation"
					lazy={async () => import("@/routes/settings/Synchronisation")}
				/>
				<Route
					path="about"
					lazy={async () => import("@/routes/settings/About")}
				/>
			</Route>
		</Route>,
	),
);

const useDb = () => {
	const [db, setDb] = useState<Database>();

	useEffect(() => {
		void initializeDb().then(setDb);
	}, []);

	return db;
};

export default function Root() {
	const db = useDb();

	return (
		<Provider db={db}>
			<ThemeProvider defaultTheme="system">
				<RouterProvider router={router} />
			</ThemeProvider>
		</Provider>
	);
}
