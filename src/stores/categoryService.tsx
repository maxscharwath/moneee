import {selector, useRecoilValue, useSetRecoilState} from 'recoil';
import {type Category, CategorySchema} from './models';
import {categoryState} from './atoms';

const getCategoryById = selector({
	key: 'getCategoryById',
	get: ({get}) => (id: string) => {
		const categories = get(categoryState);
		return categories.find(category => category.id === id);
	},
});

export const useCategoryService = () => {
	const categories = useRecoilValue(categoryState);
	const setCategories = useSetRecoilState(categoryState);

	const addCategory = (newCategory: Omit<Category, 'id'>) => {
		const validatedCategory = CategorySchema.parse(newCategory);
		setCategories(prev => [...prev, validatedCategory]);
	};

	return {
		getCategoryById: useRecoilValue(getCategoryById),
		addCategory,
		categories,
	};
};
