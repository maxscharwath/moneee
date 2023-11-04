import {Header, HeaderTitle} from '@/components/header.tsx';
import {useTranslation} from 'react-i18next';

export function Component() {
	const {t} = useTranslation();
	return (
		<>
			<Header>
				<HeaderTitle>{t('settings.title')}</HeaderTitle>
			</Header>
			<div className='flex-1 space-y-4 overflow-y-auto p-4'>
			</div>
		</>
	);
}

Component.displayName = 'Settings';
