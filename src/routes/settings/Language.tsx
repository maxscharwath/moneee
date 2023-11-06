import {Header, HeaderTitle} from '@/components/header.tsx';
import * as List from '@/components/ui/list.tsx';
import {CheckIcon, ChevronLeft} from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {NavLink} from 'react-router-dom';
import {Button} from '@/components/ui/button.tsx';
import {useLocale} from '@/i18n.ts';

export function Component() {
	const {t, i18n, language, languages} = useLocale();

	const handleLanguageChange = (lang: string) => {
		void i18n.changeLanguage(lang);
	};

	return (
		<>
			<Header>
				<Button variant='ghost' size='icon' asChild>
					<NavLink to='/settings' className='flex items-center gap-2'>
						<ChevronLeft/>
					</NavLink>
				</Button>
				<HeaderTitle>{t('settings.language.title')}</HeaderTitle>
			</Header>
			<div className='flex-1 space-y-4 overflow-y-auto p-4'>
				<RadioGroup.Root
					value={language?.code}
					onValueChange={handleLanguageChange}>
					<List.Root>
						<List.List>
							{languages.map(({code, name}) => (
								<RadioGroup.Item asChild value={code} key={code}>
									<List.ItemButton>
										<span className='font-bold text-muted-foreground'>{name}</span>
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

Component.displayName = 'Settings.Language';
