import {BarChartBig, PlusIcon, Settings2} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {NavLink, Outlet} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
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
			<Dialog.Root open={showModal} onOpenChange={setShowModal}>
				<Dialog.Content
					className='fixed inset-0 z-50 bg-background/90 backdrop-blur-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]'>
					<TransactionModal onTransaction={handleTransaction}/>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	);
}
