import {useRegisterSW} from 'virtual:pwa-register/react';
import {Header, HeaderTitle} from '@/components/header';
import {initializeDb, useSettings} from '@/stores/db';
import * as List from '@/components/ui/list';
import {
	CloudIcon,
	CoinsIcon,
	ContrastIcon,
	DownloadIcon,
	LanguagesIcon,
	LayoutGridIcon,
	MonitorIcon,
	MoonIcon,
	SaveIcon,
	SunIcon,
	Trash2Icon,
	UploadIcon,
} from 'lucide-react';
import {abbreviatedSha} from '@build/info';
import {version} from '@build/package';
import {type Transaction, TransactionSchema} from '@/stores/schemas/transaction';
import {type Category} from '@/stores/schemas/category';
import {useLocale} from '@/i18n';
import * as TabsGroup from '@/components/ui/tabs-group';
import {Container} from '@/components/container';
import {SettingItem} from '@/components/settings-item';

export function Component() {
	const {
		t,
		language,
	} = useLocale();

	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW();

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

							<SettingItem
								icon={ContrastIcon}
								color='#89cff0'
								title={t('settings.root.appearance')}
							>
								<TabsGroup.Root
									size='sm'
									value={settings?.appearance ?? 'system'}
									onValueChange={value => setSettings({appearance: value as 'light' | 'dark' | 'system'})}
								>
									<TabsGroup.Item value='light' asChild>
										<SunIcon/>
									</TabsGroup.Item>
									<TabsGroup.Item value='dark' asChild>
										<MoonIcon/>
									</TabsGroup.Item>
									<TabsGroup.Item value='system' asChild>
										<MonitorIcon/>
									</TabsGroup.Item>
								</TabsGroup.Root>
							</SettingItem>

							<SettingItem
								icon={CoinsIcon}
								color='#ffb6c1'
								title={t('settings.root.currency')}
								href='/settings/currency'
								value={settings?.currency}
								chevron
							/>

							<SettingItem
								icon={LanguagesIcon}
								color='#5a96ee'
								title={t('settings.root.language')}
								href='/settings/language'
								value={language?.name}
								chevron
							/>

							<SettingItem
								icon={LayoutGridIcon}
								color='#c3aed6'
								title={t('settings.root.categories')}
								href='/settings/categories'
								chevron
							/>

						</List.List>
						<List.List heading={t('settings.root.data')}>
							<SettingItem
								icon={UploadIcon}
								color='#77dd77'
								title={t('settings.root.export')}
								action={exportToCsv}
								chevron
							/>

							<SettingItem
								icon={DownloadIcon}
								color='#ffcc5c'
								title={t('settings.root.import')}
								chevron
							/>

							<SettingItem
								icon={Trash2Icon}
								color='#ff6961'
								title={t('settings.root.erase.title')}
								alert={{
									title: t('settings.root.erase.alert.title'),
									description: t('settings.root.erase.alert.description'),
									confirmText: t('settings.root.erase.alert.confirm'),
									cancelText: t('settings.root.erase.alert.cancel'),
									onConfirm: resetDb,
								}}
								chevron
							/>

							<SettingItem
								icon={CloudIcon}
								color='#b19cd9'
								title={t('settings.root.synchronisation')}
								href='/settings/synchronisation'
								chevron
							/>

							<SettingItem
								icon={SaveIcon}
								color='#ffb347'
								title={t('settings.root.refreshCache')}
								action={async () => updateServiceWorker(true)}
								value={needRefresh
									? t('settings.cache.newVersionAvailable')
									: t('settings.cache.upToDate')
								}
								chevron
							/>

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

const formatCSV = (transactions: Transaction[], categories: Category[]) => {
	const escapeField = (field?: string) =>
		field ? `"${field.replace(/"/g, '""')}"` : '';

	const headers = ['Amount', 'Date', 'Note', 'Category Name', 'Category Type']
		.map(escapeField).join(',');

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

	return [headers, ...rows].join('\n');
};

const exportToCsv = async () => {
	try {
		const db = await initializeDb();
		const transactions = await db.transactions.find({
			sort: [{date: 'desc'}],
		})
			.exec();
		const categories = await db.categories.find()
			.exec();
		const content = formatCSV(transactions, categories);

		const file = new File([content], 'transactions.csv', {type: 'text/csv'});

		if (navigator.share) {
			await navigator.share({
				title: 'Transactions',
				text: 'Transactions CSV',
				files: [file],
			});
		} else {
			download(file);
		}

		console.log('Export successful!');
	} catch (error) {
		console.error('Export failed:', error);
	}
};

const download = (file: File) => {
	const a = document.createElement('a');
	const url = URL.createObjectURL(file);
	a.href = url;
	a.download = file.name;
	a.click();
	URL.revokeObjectURL(url);
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
