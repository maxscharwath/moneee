import {Header, HeaderTitle} from '@/components/header.tsx';
import {useTranslation} from 'react-i18next';
import * as List from '@/components/ui/list.tsx';
import {ChevronLeft} from 'lucide-react';
import {NavLink} from 'react-router-dom';
import {Button} from '@/components/ui/button.tsx';
import {getCategoriesByType} from '@/stores/db.ts';
import {Container} from '@/components/Container.tsx';
import * as TabsGroup from '@/components/ui/tabs-group.tsx';
import React from 'react';

export function Component() {
	const {t} = useTranslation();
	const [type, setType] = React.useState<'income' | 'expense'>('expense');
	const {result: categories} = getCategoriesByType(type);

	return (
		<>
			<Header>
				<Button variant='ghost' size='icon' asChild>
					<NavLink to='/settings' className='flex items-center gap-2' state={{direction: 'left'}}>
						<ChevronLeft/>
					</NavLink>
				</Button>
				<HeaderTitle>{t('settings.root.categories')}</HeaderTitle>
			</Header>
			<Container>
				<div className='flex w-full items-center justify-center gap-4'>
					<TabsGroup.Root
						value={type}
						onValueChange={t => {
							setType(t as 'income' | 'expense');
						}}
					>
						<TabsGroup.Item value='income'>
							{t('transaction.income')}
						</TabsGroup.Item>
						<TabsGroup.Item value='expense'>
							{t('transaction.expense')}
						</TabsGroup.Item>
					</TabsGroup.Root>
				</div>
				<List.Root>
					<List.List>
						{categories?.map(category => (
							<List.Item key={category.uuid}>
								<List.ItemIcon style={{backgroundColor: category.color}}>
									{category.icon}
								</List.ItemIcon>
								<span className='grow truncate'>{category.name}</span>
							</List.Item>
						))}
					</List.List>
				</List.Root>
			</Container>
		</>
	);
}

Component.displayName = 'Settings.Categories';
