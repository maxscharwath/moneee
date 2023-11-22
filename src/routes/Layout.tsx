import { BarChartBig, PlusIcon, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    type Location,
    NavLink,
    useLocation,
    useOutlet,
} from 'react-router-dom';
import TransactionModal from '@/components/transaction-modal';
import React, { useState } from 'react';
import { addTransaction } from '@/stores/db';
import { AnimatePresence, motion } from 'framer-motion';
import { Footer } from '@/components/footer';
import { type Optional } from '@/lib/utils';
import { type Transaction } from '@/stores/schemas/transaction';

const LayoutContext = React.createContext<{
    openTransactionModal: (transaction?: Transaction) => void;
} | null>(null);

export const useLayout = () => {
    const context = React.useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }

    return context;
};

export default function Layout() {
    const [showModal, setShowModal] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | undefined>(
        undefined
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

    const handleTransaction = (transaction: Optional<Transaction, 'uuid'>) => {
        void addTransaction(transaction);
        setShowModal(false);
    };

    const location = useLocation() as Location<{ direction: Direction }>;
    const outlet = useOutlet();

    const direction = location.state?.direction ?? 'none';

    return (
        <div className="flex h-[100dvh] flex-col">
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
                            <NavLink to="/settings">
                                <Settings2 />
                            </NavLink>
                        </Button>
                    </div>
                </div>
            </Footer>
            <TransactionModal
                open={showModal}
                onOpenChange={toggleTransactionModal}
                onTransaction={handleTransaction}
                transaction={transaction}
                key={transaction?.uuid}
            />
        </div>
    );
}

type Direction = 'left' | 'right' | 'none';

const DirectionalTransition: React.FC<
    React.PropsWithChildren<{
        classname: string;
        direction: Direction;
        value: string;
    }>
> = ({ children, classname, direction, value }) => {
    const variants = {
        enter: (direction: Direction) =>
            direction === 'none'
                ? {}
                : {
                      x: direction === 'left' ? '-80vw' : '80vw',
                      opacity: 0,
                  },
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: Direction) =>
            direction === 'none'
                ? {}
                : {
                      x: direction === 'left' ? '80vw' : '-80vw',
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
                    ease: 'easeInOut',
                    duration: 0.2,
                }}
            >
                {children}
            </motion.main>
        </AnimatePresence>
    );
};
