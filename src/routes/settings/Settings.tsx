import {Header, HeaderTitle} from '@/components/header.tsx';
import {initializeDb, useSettings} from '@/stores/db.ts';
import * as List from '@/components/ui/list.tsx';
import {
	ChevronRight,
	CoinsIcon,
	ContrastIcon,
	DownloadIcon,
	LanguagesIcon,
	LayoutGridIcon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
	Trash2Icon,
	UploadIcon,
} from 'lucide-react';
import {NavLink} from 'react-router-dom';
import {abbreviatedSha} from '@build/info';
import {version} from '@build/package';
import {type Transaction, TransactionSchema} from '@/stores/schemas/transaction.ts';
import {type Category} from '@/stores/schemas/category.ts';
import {useLocale} from '@/i18n.ts';
import * as TabsGroup from '@/components/ui/tabs-group.tsx';
import {Container} from '@/components/container.tsx';
import * as Alert from '@/components/ui/alert-dialog';
import {Spacing} from '@/components/spacing.tsx';

export function Component() {
	const {t, language} = useLocale();
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
			const category = categories.find(cat => cat.uuid === transaction.categoryId);
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
				schema: TransactionSchema,
			},
		});
	};

	const [settings, setSettings] = useSettings();

	return (
		<>
			<Header>
				<HeaderTitle>{t('settings.root.title')}</HeaderTitle>
			</Header>
			<Container>
				<div className='min-h-full'>
					<List.Root>
						<List.List heading={t('settings.root.general')}>
							<List.Item>
								<List.ItemIcon className='bg-[#89cff0]'>
									<ContrastIcon />
								</List.ItemIcon>
								<span className='truncate'>{t('settings.root.appearance')}</span>
								<Spacing/>
								<TabsGroup.Root
									size='sm'
									value={settings?.appearance ?? 'system'}
									onValueChange={value => setSettings({appearance: value as 'light' | 'dark' | 'system'})}
								>
									<TabsGroup.Item value='light' asChild>
										<SunIcon />
									</TabsGroup.Item>
									<TabsGroup.Item value='dark' asChild>
										<MoonIcon />
									</TabsGroup.Item>
									<TabsGroup.Item value='system' asChild>
										<MonitorIcon />
									</TabsGroup.Item>
								</TabsGroup.Root>
							</List.Item>
							<List.ItemButton asChild>
								<NavLink to='/settings/currency' state={{direction: 'right'}}>
									<List.ItemIcon className='bg-[#ffb6c1]'>
										<CoinsIcon />
									</List.ItemIcon>
									<span className='truncate'>{t('settings.root.currency')}</span>
									<Spacing/>
									<span className='truncate text-muted-foreground'>
										{settings?.currency}
									</span>
									<ChevronRight className='shrink-0'/>
								</NavLink>
							</List.ItemButton>
							<List.ItemButton asChild>
								<NavLink to='/settings/language' state={{direction: 'right'}}>
									<List.ItemIcon className='bg-[#5a96ee]'>
										<LanguagesIcon />
									</List.ItemIcon>
									<span className='truncate'>{t('settings.root.language')}</span>
									<Spacing/>
									<span className='truncate text-muted-foreground'>
										{language?.name}
									</span>
									<ChevronRight className='shrink-0'/>
								</NavLink>
							</List.ItemButton>
							<List.ItemButton asChild>
								<NavLink to='/settings/categories' state={{direction: 'right'}}>
									<List.ItemIcon className='bg-[#c3aed6]'>
										<LayoutGridIcon />
									</List.ItemIcon>
									<span className='truncate'>{t('settings.root.categories')}</span>
									<Spacing/>
									<ChevronRight className='shrink-0'/>
								</NavLink>
							</List.ItemButton>
						</List.List>
						<List.List heading={t('settings.root.data')}>
							<List.ItemButton onClick={exportToCsv}>
								<List.ItemIcon className='bg-[#77dd77]'>
									<UploadIcon />
								</List.ItemIcon>
								<span className='truncate'>{t('settings.root.export')}</span>
								<Spacing/>
								<ChevronRight className='shrink-0'/>
							</List.ItemButton>
							<List.Item>
								<List.ItemIcon className='bg-[#ffcc5c]'>
									<DownloadIcon />
								</List.ItemIcon>
								<span className='truncate'>{t('settings.root.import')}</span>
								<Spacing/>
								<ChevronRight className='shrink-0'/>
							</List.Item>
							<Alert.AlertDialog>
								<Alert.AlertDialogTrigger asChild>
									<List.ItemButton>
										<List.ItemIcon className='bg-[#ff6961]'>
											<Trash2Icon />
										</List.ItemIcon>
										<span className='truncate'>{t('settings.root.erase.title')}</span>
										<Spacing/>
										<ChevronRight className='shrink-0'/>
									</List.ItemButton>
								</Alert.AlertDialogTrigger>
								<Alert.AlertDialogContent>
									<Alert.AlertDialogHeader>
										<Alert.AlertDialogTitle>{t('settings.root.erase.alert.title')}</Alert.AlertDialogTitle>
										<Alert.AlertDialogDescription>{t('settings.root.erase.alert.description')}</Alert.AlertDialogDescription>
									</Alert.AlertDialogHeader>
									<Alert.AlertDialogFooter>
										<Alert.AlertDialogCancel>
											{t('settings.root.erase.alert.cancel')}
										</Alert.AlertDialogCancel>
										<Alert.AlertDialogAction onClick={resetDb}>
											{t('settings.root.erase.alert.confirm')}
										</Alert.AlertDialogAction>
									</Alert.AlertDialogFooter>
								</Alert.AlertDialogContent>
							</Alert.AlertDialog>
						</List.List>
					</List.Root>
				</div>
				<div className='mt-4 flex justify-center gap-2'>
					<span className='text-xs font-bold text-muted-foreground'>Version: {version}</span>
					<span className='text-xs font-bold text-muted-foreground'>Build: {abbreviatedSha}</span>
				</div>
			</Container>
		</>
	);
}

Component.displayName = 'Settings.Root';
