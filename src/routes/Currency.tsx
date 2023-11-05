import {Header, HeaderTitle} from '@/components/header.tsx';
import {useTranslation} from 'react-i18next';
import * as List from '@/components/ui/list.tsx';
import {CheckIcon, ChevronLeft} from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {NavLink} from 'react-router-dom';
import {Button} from '@/components/ui/button.tsx';
import currencies from '../assets/currencies.json' assert {type: 'json'};

export function Component() {
	const {t} = useTranslation();

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
				<RadioGroup.Root defaultValue='CHF'>
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
