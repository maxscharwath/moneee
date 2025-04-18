import type * as React from "react";
import { useEffect, useRef, useState } from "react";

export function useAsync<T>(
	fn: () => Promise<T>,
	deps: React.DependencyList = [],
) {
	const fnRef = useRef(fn);
	const [state, setState] = useState<{
		status: "idle" | "pending" | "success" | "error";
		data: T | null;
		error: Error | null;
	}>({
		status: "idle",
		data: null,
		error: null,
	});

	useEffect(() => {
		setState({ status: "pending", data: null, error: null });
		fnRef.current().then(
			(data) =>
				setState({
					status: "success",
					data,
					error: null,
				}),
			(error: Error) =>
				setState({
					status: "error",
					data: null,
					error,
				}),
		);
	}, deps);

	return state;
}
