import { useRegisterSW } from "virtual:pwa-register/react";
import { Footer } from "@/components/footer";
import { TransactionModal } from "@/components/transaction-modal";
import { Button } from "@/components/ui/button";
import { Indicator } from "@/components/ui/indicator";
import { addRecurrence } from "@/hooks/useRecurrence";
import { addTransaction } from "@/hooks/useTransaction";
import type { Optional } from "@/lib/utils";
import type { Recurrence } from "@/stores/schemas/recurrence";
import type { Transaction } from "@/stores/schemas/transaction";
import { AnimatePresence, motion } from "framer-motion";
import { BarChartBig, PlusIcon, Settings2 } from "lucide-react";
import React, { useState } from "react";
import {
	type Location,
	NavLink,
	useLocation,
	useOutlet,
} from "react-router-dom";

const LayoutContext = React.createContext<{
	openTransactionModal: (transaction?: Transaction) => void;
} | null>(null);

export const useLayout = () => {
	const context = React.useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}

	return context;
};

export default function Layout() {
	const [showModal, setShowModal] = useState(false);
	const [transaction, setTransaction] = useState<Transaction | undefined>(
		undefined,
	);

	const openTransactionModal = (transaction?: Transaction) => {
		setTransaction(transaction);
		setShowModal(true);
	};

	const toggleTransactionModal = (open: boolean) => {
		if (!open) {
			setTransaction(undefined);
		}

		setShowModal(open);
	};

	const handleTransaction = (transaction: Optional<Transaction, "uuid">) => {
		void addTransaction(transaction);
		setShowModal(false);
	};

	const handleRecurrence = (recurrence: Optional<Recurrence, "uuid">) => {
		void addRecurrence(recurrence);
		setShowModal(false);
	};

	const location = useLocation() as Location<{ direction: Direction }>;
	const outlet = useOutlet();
	const {
		needRefresh: [needRefresh],
	} = useRegisterSW();

	const direction = location.state?.direction ?? "none";

	return (
		<div className="relative flex h-[100dvh] flex-col overflow-hidden">
			<LayoutContext.Provider value={{ openTransactionModal }}>
				<DirectionalTransition
					classname="flex flex-1 flex-col overflow-hidden bg-background px-safe"
					direction={direction}
					value={location.pathname}
				>
					{outlet}
				</DirectionalTransition>
			</LayoutContext.Provider>
			<Footer>
				<div className="grid w-full grid-cols-[1fr,auto,1fr] items-center gap-4">
					<div className="flex justify-evenly">
						<Button variant="navlink" size="icon" asChild>
							<NavLink to="/">
								<BarChartBig />
							</NavLink>
						</Button>
					</div>
					<Button onClick={() => openTransactionModal()}>
						<PlusIcon />
					</Button>
					<div className="flex justify-evenly">
						<Button variant="navlink" size="icon" asChild>
							<NavLink to="/settings" className="relative">
								<Settings2 />
								{needRefresh && (
									<Indicator variant="red" position="top-right" size="sm" />
								)}
							</NavLink>
						</Button>
					</div>
				</div>
			</Footer>
			<TransactionModal
				open={showModal}
				onOpenChange={toggleTransactionModal}
				onTransaction={handleTransaction}
				onRecurrence={handleRecurrence}
				transaction={transaction}
				key={transaction?.uuid}
			/>
		</div>
	);
}

type Direction = "left" | "right" | "none";

const DirectionalTransition: React.FC<
	React.PropsWithChildren<{
		classname: string;
		direction: Direction;
		value: string;
	}>
> = ({ children, classname, direction, value }) => {
	const variants = {
		enter: (direction: Direction) =>
			direction === "none"
				? {}
				: {
						x: direction === "left" ? "-80vw" : "80vw",
						opacity: 0,
					},
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: Direction) =>
			direction === "none"
				? {}
				: {
						x: direction === "left" ? "80vw" : "-80vw",
						opacity: 0,
					},
	};

	return (
		<AnimatePresence mode="popLayout" initial={false} custom={direction}>
			<motion.main
				className={classname}
				key={value}
				custom={direction}
				variants={variants}
				initial="enter"
				animate="center"
				exit="exit"
				transition={{
					ease: "easeInOut",
					duration: 0.25,
				}}
			>
				{children}
			</motion.main>
		</AnimatePresence>
	);
};
