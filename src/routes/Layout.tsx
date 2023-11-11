import {BarChartBig, PlusIcon, Settings2} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {NavLink, useLocation, useOutlet, type Location} from 'react-router-dom';
import TransactionModal from '@/components/transaction-modal.tsx';
import type React from 'react';
import {useState} from 'react';
import {addTransaction} from '@/stores/db.ts';
import {AnimatePresence, motion} from 'framer-motion';
import {Footer} from '@/components/footer.tsx';

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

	const location = useLocation() as Location<{direction: Direction}>;
	const outlet = useOutlet();

	const direction = location.state?.direction ?? 'none';

	return (
		<div className='flex h-[100dvh] flex-col'>
			<DirectionalTransition classname='flex flex-1 flex-col overflow-hidden bg-background px-safe' direction={direction} value={location.pathname}>
				{outlet}
			</DirectionalTransition>
			<Footer>
				<div
					className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-4'>
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
				</div>
			</Footer>
			<TransactionModal open={showModal} onOpenChange={setShowModal} onTransaction={handleTransaction}/>
		</div>
	);
}

type Direction = 'left' | 'right' | 'none';

const DirectionalTransition: React.FC<React.PropsWithChildren<{classname: string;direction: Direction;value: string}>> = ({children, classname, direction, value}) => {
	const variants = {
		enter: (direction: Direction) => direction === 'none' ? {} : {
			x: direction === 'left' ? '-80vw' : '80vw',
			opacity: 0,
		},
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: Direction) => direction === 'none' ? {} : {
			x: direction === 'left' ? '80vw' : '-80vw',
			opacity: 0,
		},
	};

	return (
		<AnimatePresence mode='popLayout' initial={false} custom={direction}>
			<motion.main
				className={classname}
				key={value}
				custom={direction}
				variants={variants}
				initial='enter'
				animate='center'
				exit='exit'
				transition={{ease: 'easeInOut', duration: 0.2}}
			>
				{children}
			</motion.main>
		</AnimatePresence>
	);
};
