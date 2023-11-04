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
					<List.Group heading={t('settings.general')}>
						<List.Item>
							<List.ItemIcon className='bg-[#89cff0]'>
								<ContrastIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.appearance')}</span>
							<ChevronRight className='ml-auto'/>
						</List.Item>
						<List.Item>
							<List.ItemIcon className='bg-[#ffb6c1]'>
								<CoinsIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.currency')}</span>
							<ChevronRight className='ml-auto'/>
						</List.Item>
						<List.Item>
							<List.ItemIcon className='bg-[#c3aed6]'>
								<LayoutGridIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.categories')}</span>
							<ChevronRight className='ml-auto'/>
						</List.Item>
					</List.Group>
					<List.Group heading={t('settings.data')}>
						<List.Item onClick={exportToCsv}>
							<List.ItemIcon className='bg-[#77dd77]'>
								<UploadIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.export')}</span>
							<ChevronRight className='ml-auto'/>
						</List.Item>
						<List.Item>
							<List.ItemIcon className='bg-[#ffcc5c]'>
								<DownloadIcon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.import')}</span>
							<ChevronRight className='ml-auto'/>
						</List.Item>
						<List.Item onClick={resetDb}>
							<List.ItemIcon className='bg-[#ff6961]'>
								<Trash2Icon />
							</List.ItemIcon>
							<span className='truncate'>{t('settings.erase')}</span>
							<ChevronRight className='ml-auto'/>
						</List.Item>
					</List.Group>
				</List.Root>
			</div>
		</>
	);
}

Component.displayName = 'Settings';
