import {
    DialogRoot,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { useDelayFunction } from '@/hooks/useDelayFunction';
import { useLocale } from '@/i18n';

type CalendarInputProps = {
    date: Date;
    setDate: (date: Date) => void;
};

export const CalendarInput = ({ date, setDate }: CalendarInputProps) => {
    const { formatter, language } = useLocale();
    const [isOpen, setIsOpen] = useState(false);

    const close = useDelayFunction(() => setIsOpen(false), 1000);

    const handleSelect = (date?: Date) => {
        if (date) {
            setDate(date);
            close();
        }
    };

    return (
        <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="grow overflow-hidden">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                        {formatter.date(date, {
                            dateStyle: 'medium',
                        })}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Calendar
                    locale={language?.locale}
                    mode="single"
                    weekStartsOn={1}
                    showOutsideDays={false}
                    fixedWeeks={true}
                    selected={date}
                    onSelect={handleSelect}
                    initialFocus
                />
            </DialogContent>
        </DialogRoot>
    );
};
