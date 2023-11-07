import {Header, HeaderTitle} from '@/components/header.tsx';
import {useTranslation} from 'react-i18next';
import * as List from '@/components/ui/list.tsx';
import {CheckIcon, ChevronLeft} from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {NavLink} from 'react-router-dom';
import {Button} from '@/components/ui/button.tsx';
import {useSettings} from '@/stores/db.ts';
import {Container} from '@/components/Container.tsx';
import {useEffect, useState} from 'react';

type Currency = {
	code: string;
	name: string;
};

function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
	const [state, setState] = useState<{
		status: 'idle' | 'pending' | 'success' | 'error';
		data: T | null;
		error: Error | null;
	}>({
		status: 'idle',
		data: null,
		error: null,
	});

	useEffect(() => {
		setState({status: 'pending', data: null, error: null});
		fn().then(
			data => setState({status: 'success', data, error: null}),
			(error: Error) => setState({status: 'error', data: null, error}),
		);
	}, deps);

	return state;
}

export function Component() {
	const {t} = useTranslation();
	const [settings, setSettings] = useSettings();
	const {data} = useAsync<Currency[]>(async () => (await import('../../assets/currencies.json')).default, []);

	const handleCurrencyChange = (currency: string) => {
		setSettings({currency});
	};

	return (
		<>
			<Header>
				<Button variant='ghost' size='icon' asChild>
					<NavLink to='/settings' className='flex items-center gap-2' state={{direction: 'left'}}>
						<ChevronLeft/>
					</NavLink>
				</Button>
				<HeaderTitle>{t('settings.currency.title')}</HeaderTitle>
			</Header>
			<Container>
				<RadioGroup.Root
					value={settings?.currency}
					onValueChange={handleCurrencyChange}>
					<List.Root>
						<List.List>
							{data?.map(({code, name}) => (
								<RadioGroup.Item asChild value={code} key={code}>
									<List.ItemButton>
										<span className='font-bold text-muted-foreground'>{code}</span>
										<span className='truncate'>{name}</span>
										<RadioGroup.Indicator asChild>
											<CheckIcon className='ml-auto shrink-0'/>
										</RadioGroup.Indicator>
									</List.ItemButton>
								</RadioGroup.Item>
							))}
						</List.List>
					</List.Root>
				</RadioGroup.Root>
			</Container>
		</>
	);
}

Component.displayName = 'Settings.Currency';
