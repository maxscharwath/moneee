import { Spacing } from "@/components/spacing";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useDelayFunction } from "@/hooks/useDelayFunction";
import { useLocale } from "@/i18n";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type CalendarInputProps = {
	date: Date;
	setDate: (date: Date) => void;
};

export const CalendarInput = ({ date, setDate }: CalendarInputProps) => {
	const { t, formatter, language } = useLocale();
	const [isOpen, setIsOpen] = useState(false);

	const close = useDelayFunction(() => setIsOpen(false), 1000);

	const handleSelect = (date?: Date) => {
		if (date) {
			setDate(date);
			close();
		}
	};

	const formatDate = (date: Date) => {
		const today = new Date();

		if (date.toDateString() === today.toDateString()) {
			return `${t("date.today")}, ${formatter.date(date, {
				day: "numeric",
				month: "short",
			})}`;
		}
		return formatter.date(date, {
			weekday: "short",
			day: "numeric",
			month: "short",
		});
	};

	const formatTime = (date: Date) => {
		return formatter.time(date, {
			hour: "numeric",
			minute: "numeric",
		});
	};

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className="grow overflow-hidden">
					<CalendarIcon className="h-4 w-4 shrink-0" />
					<span className="truncate">{formatDate(date)}</span>
					<Spacing />
					<span className="truncate">{formatTime(date)}</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="m-auto max-h-[50vh] w-full max-w-lg p-4">
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
			</DrawerContent>
		</Drawer>
	);
};
