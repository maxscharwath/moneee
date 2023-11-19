import {Header, HeaderTitle} from '@/components/header';
import {ChevronLeft, FingerprintIcon, ScanFaceIcon} from 'lucide-react';
import {NavLink} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {useLocale} from '@/i18n';
import {Container} from '@/components/container';
import {useState} from 'react';
import * as TabsGroup from '@/components/ui/tabs-group';

export function Component() {
	const {t} = useLocale();
	const [mode, setMode] = useState<'register' | 'login'>('register');
	const [id, setId] = useState<string | undefined>(undefined);

	const auth = async () => {
		const credential = await navigator.credentials.create({
			publicKey: {
				challenge: crypto.getRandomValues(new Uint8Array(32)),
				rp: {
					id: window.location.hostname,
					name: 'Moneee',
				},
				user: {
					id: crypto.getRandomValues(new Uint8Array(32)),
					displayName: 'Moneee',
					name: 'Moneee',
				},
				pubKeyCredParams: [{
					type: 'public-key',
					alg: -7,
				}],
			},
		});
		console.log(credential);
		setId(credential?.id);
	};

	const login = async () => {
		const credential = await navigator.credentials.get({
			publicKey: {
				challenge: crypto.getRandomValues(new Uint8Array(32)),
				rpId: window.location.hostname,
				userVerification: 'required',
			},
		});
		console.log(credential);
		setId(credential?.id);
	};

	return (
		<>
			<Header>
				<Button variant='ghost' size='icon' asChild>
					<NavLink to='/settings' className='flex items-center gap-2' state={{direction: 'left'}}>
						<ChevronLeft/>
					</NavLink>
				</Button>
				<HeaderTitle>{t('settings.synchronisation.title')}</HeaderTitle>
			</Header>
			<Container>
				<div className='flex w-full items-center justify-center gap-4'>
					<TabsGroup.Root
						value={mode}
						onValueChange={t => {
							setMode(t as 'register' | 'login');
						}}
					>
						<TabsGroup.Item value='register'>
							{t('settings.synchronisation.register')}
						</TabsGroup.Item>
						<TabsGroup.Item value='login'>
							{t('settings.synchronisation.login')}
						</TabsGroup.Item>
					</TabsGroup.Root>
				</div>
				<div className='flex flex-col items-center justify-center gap-4'>
					{id && <p className='text-gray-500'>{id}</p>}
					{mode === 'register' ? (<>
						<p className='text-gray-500'>{t('settings.synchronisation.authenticateWithDevice')}</p>
						<Button variant='default' size='lg' onClick={auth}>
							<FingerprintIcon/>
							{t('settings.synchronisation.register')}
						</Button>
					</>) : (<>
						<p className='text-gray-500'>{t('settings.synchronisation.loginWithDevice')}</p>
						<Button variant='default' size='lg' onClick={login}>
							<ScanFaceIcon/>
							{t('settings.synchronisation.login')}
						</Button>
					</>)}
				</div>
			</Container>
		</>
	);
}

Component.displayName = 'Settings.Synchronisation';
