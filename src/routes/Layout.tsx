import {BarChartBig, PlusIcon, Settings2} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {NavLink, Outlet} from 'react-router-dom';
import TransactionModal from '@/components/transaction-modal.tsx';
import {useState} from 'react';
import {addTransaction} from '@/stores/db.ts';

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

	return (
		<div className='flex h-[100dvh] flex-col'>
			<Outlet/>
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
