import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import { ClockIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type TimeInputProps = {
	date: Date;
	setDate: Dispatch<SetStateAction<Date>>;
};

export const TimeInput = ({ date, setDate }: TimeInputProps) => {
	const { formatter } = useLocale();

	const formatTime = (date: Date) => {
		return formatter.time(date, {
			hour: "numeric",
			minute: "numeric",
		});
	};

	const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [hours, minutes] = e.target.value.split(":");
		if (!hours || !minutes) return;
		setDate((current) => {
			const next = new Date(current);
			next.setHours(Number(hours));
			next.setMinutes(Number(minutes));
			next.setSeconds(0);
			next.setMilliseconds(0);
			return next;
		});
	};

	return (
		<Button
			variant="outline"
			className="relative shrink overflow-hidden"
			asChild
		>
			<label>
				<div className="absolute inset-y-0 left-3 flex items-center">
					<ClockIcon className="h-4 w-4 shrink-0" />
				</div>
				<input
					type="time"
					value={formatTime(date)}
					className="flex h-10 w-full bg-transparent border-0 outline-0 pl-5"
					onChange={handleSelect}
				/>
			</label>
		</Button>
	);
};
