import { geolocation } from "@vercel/edge";

export const config = {
	runtime: "edge",
};

export default function hello(request: Request) {
	const { city } = geolocation(request);
	return new Response(`<h1>Your location is ${city}</h1>`, {
		headers: { "content-type": "text/html" },
	});
}
