import {Header, HeaderTitle} from '@/components/header.tsx';
import {useTranslation} from 'react-i18next';
import * as List from '@/components/ui/list.tsx';
import {CheckIcon, ChevronLeft} from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {type LoaderFunction, NavLink, useLoaderData} from 'react-router-dom';
import {Button} from '@/components/ui/button.tsx';
import {useSettings} from '@/stores/db.ts';

export const loader: LoaderFunction = async () => (await import('../assets/currencies.json')).default;

type Currency = {
	code: string;
	name: string;
};

export function Component() {
	const {t} = useTranslation();
	const currencies = useLoaderData() as Currency[];
	const [settings, setSettings] = useSettings();

	const handleCurrencyChange = (currency: string) => {
		console.log(currency);
		setSettings({currency});
	};

	return (
		<>
			<Header>
				<Button variant='ghost' size='icon' asChild>
					<NavLink to='/settings' className='flex items-center gap-2'>
						<ChevronLeft/>
					</NavLink>
				</Button>
				<HeaderTitle>{t('settings.currency.title')}</HeaderTitle>
			</Header>
			<div className='flex-1 space-y-4 overflow-y-auto p-4'>
				<RadioGroup.Root
					value={settings?.currency}
					onValueChange={handleCurrencyChange}>
					<List.Root>
						<List.List>
							{currencies.map(({code, name}) => (
								<RadioGroup.Item asChild value={code} key={code}>
									<List.ItemButton>
										<span className='font-bold text-muted-foreground'>{code}</span>
										<span className='truncate'>{name}</span>
										<RadioGroup.Indicator asChild>
											<CheckIcon className='ml-auto'/>
										</RadioGroup.Indicator>
									</List.ItemButton>
								</RadioGroup.Item>
							))}
						</List.List>
					</List.Root>
				</RadioGroup.Root>
			</div>
		</>
	);
}

Component.displayName = 'Settings.Currency';
