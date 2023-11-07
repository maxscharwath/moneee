import {BarChartBig, PlusIcon, Settings2} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {NavLink, useLocation, useOutlet} from 'react-router-dom';
import TransactionModal from '@/components/transaction-modal.tsx';
import React, {useState} from 'react';
import {addTransaction} from '@/stores/db.ts';
import {AnimatePresence, motion} from 'framer-motion';

export default function Layout() {
	const [showModal, setShowModal] = useState(false);
	const handleTransaction = (amount: number, date: Date, categoryId: string, note: string) => {
		void addTransaction({
			note,
			amount,
			category_id: categoryId,
			date: date.toISOString(),
		});

		setShowModal(false);
	};

	const location = useLocation();
	const outlet = useOutlet();
	return (
		<div className='flex h-[100dvh] flex-col'>
			<AnimatePresence mode='popLayout' initial={false}>
				<motion.main className='flex grow flex-col overflow-hidden bg-background'
					key={location.pathname}
					initial={{x: '80vw', scale: 0.9, opacity: 0}}
					animate={{x: 0, scale: 1, opacity: 1}}
					exit={{x: '-80vw', scale: 0.9, opacity: 0}}
					transition={{ease: 'easeInOut', duration: 0.2}}
				>
					{outlet && React.cloneElement(outlet, {key: location.pathname})}
				</motion.main>
			</AnimatePresence>
			<nav
				className='grid w-full grid-cols-[1fr,auto,1fr] bg-background p-4'>
				<div className='flex justify-evenly'>
					<Button variant='navlink' size='icon' asChild>
						<NavLink to='/'>
							<BarChartBig size={24}/>
						</NavLink>
					</Button>
				</div>
				<Button onClick={() => setShowModal(true)}>
					<PlusIcon size={24}/>
				</Button>
				<div className='flex justify-evenly'>
					<Button variant='navlink' size='icon' asChild>
						<NavLink to='/settings'>
							<Settings2 size={24}/>
						</NavLink>
					</Button>
				</div>
			</nav>
			<TransactionModal open={showModal} onOpenChange={setShowModal} onTransaction={handleTransaction}/>
		</div>
	);
}
