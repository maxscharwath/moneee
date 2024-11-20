import { useCallback, useState } from "react";

type Page<T> = {
	items: T[];
	hasNext: boolean;
	page: number;
	nextPage: () => void;
};

const takeResult = <T>(generator: Generator<T>, size: number) => {
	const items: T[] = [];
	for (let i = 0; i < size; i++) {
		const result = generator.next();
		if (result.done) {
			return { done: true, value: items };
		}
		items.push(result.value);
	}
	return { done: false, value: items };
};

export const usePage = <T>(gen: Generator<T>, size: number): Page<T> => {
	const [generator] = useState(gen);
	const [result, setResult] = useState(() => takeResult(generator, size));
	const [page, setPage] = useState(1);
	const nextPage = useCallback(() => {
		if (!result.done) {
			setPage((page) => page + 1);
			setResult(takeResult(generator, size));
		}
	}, [generator, size, result]);
	return {
		items: result.value,
		hasNext: !result.done,
		page,
		nextPage,
	};
};
