import {Header, HeaderTitle} from '@/components/header.tsx';
import {useTranslation} from 'react-i18next';
import {
	type Category,
	initializeDb,
	type Transaction,
	TransactionSchemaTyped,
} from '@/stores/db.ts';
import * as List from '@/components/ui/list.tsx';
import {
	ChevronRight,
	DownloadIcon,
	UploadIcon,
	Trash2Icon,
	ContrastIcon,
	CoinsIcon, LayoutGridIcon,
} from 'lucide-react';
import {NavLink} from 'react-router-dom';

export function Component() {
	const {t} = useTranslation();
	const formatCSV = (transactions: Transaction[], categories: Category[]) => {
		const headers = ['Amount', 'Date', 'Note', 'Category Name', 'Category Type'];

		const escapeField = (field?: string) => {
			if (!field) {
				return '';
			}

			if (field.includes(',') || field.includes('\n') || field.includes('"')) {
				return `"${field.replace(/"/g, '""')}"`; // Double up any double quotes and wrap field in double quotes
			}

			return field;
		};

		const rows = transactions.map(transaction => {
			const category = categories.find(cat => cat.uuid === transaction.category_id);
			return [
				transaction.amount,
				new Date(transaction.date).toLocaleString(),
				escapeField(transaction.note),
				escapeField(category?.name),
				escapeField(category?.type),
			].join(',');
		});

		return [headers.join(','), ...rows].join('\n');
	};

	const exportToCsv = async () => {
		try {
			const db = await initializeDb();
			const transactions = await db.transactions.find({
				sort: [{date: 'desc'}],
			}).exec();
			const categories = await db.categories.find().exec();
			const content = formatCSV(transactions, categories);

			await navigator.share({
				title: 'Transactions',
				text: 'Transactions CSV',
				files: [new File([content], 'transactions.csv', {type: 'text/csv'})],
			});

			console.log('Export successful!');
		} catch (error) {
			console.error('Export failed:', error);
		}
	};

	const resetDb = async () => {
		const db = await initializeDb();
		await db.transactions.remove();
		await db.addCollections({
			transactions: {
				schema: TransactionSchemaTyped,
			},
		});
	};

	return (
		<>
			<Header>
				<HeaderTitle>{t('settings.title')}</HeaderTitle>
			</Header>
			<div className='flex-1 space-y-4 overflow-y-auto p-4'>
				<List.Root>
					<List.List heading={t('settings.general')}>
						<List.Item>
							<List.ItemIcon className='bg-[#89cff0]'>
								<ContrastIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.appearance')}</span>
							<Spacing/>
							<ChevronRight/>
						</List.Item>
						<List.ItemButton asChild>
							<NavLink to='/settings/currency'>
								<List.ItemIcon className='bg-[#ffb6c1]'>
									<CoinsIcon />
								</List.ItemIcon>
								<span className='truncate'>{t('settings.currency')}</span>
								<Spacing/>
								<span className='truncate text-muted-foreground'>CHF</span>
								<ChevronRight/>
							</NavLink>
						</List.ItemButton>
						<List.Item>
							<List.ItemIcon className='bg-[#c3aed6]'>
								<LayoutGridIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.categories')}</span>
							<Spacing/>
							<ChevronRight/>
						</List.Item>
					</List.List>
					<List.List heading={t('settings.data')}>
						<List.ItemButton onClick={exportToCsv}>
							<List.ItemIcon className='bg-[#77dd77]'>
								<UploadIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.export')}</span>
							<Spacing/>
							<ChevronRight/>
						</List.ItemButton>
						<List.Item>
							<List.ItemIcon className='bg-[#ffcc5c]'>
								<DownloadIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.import')}</span>
							<Spacing/>
							<ChevronRight/>
						</List.Item>
						<List.ItemButton onClick={resetDb}>
							<List.ItemIcon className='bg-[#ff6961]'>
								<Trash2Icon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.erase')}</span>
							<Spacing/>
							<ChevronRight/>
						</List.ItemButton>
					</List.List>
				</List.Root>
			</div>
		</>
	);
}

Component.displayName = 'Settings';

const Spacing = () => <div className='ml-auto'/>;
