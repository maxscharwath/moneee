import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@/i18n";
import "@/stores/db";
import Root from "@/Root";

const rootElement = document.getElementById("root");

rootElement &&
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Root />
		</React.StrictMode>,
	);
