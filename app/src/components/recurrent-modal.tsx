import { Container } from "@/components/container";
import { Currency } from "@/components/currency";
import { Header } from "@/components/header";
import { SettingItem } from "@/components/settings-item";
import { Button } from "@/components/ui/button";
import { usePage } from "@/hooks/usePage";
import { useLocale } from "@/i18n";
import type { Recurrence } from "@/stores/schemas/recurrence";
import type { DialogProps } from "@radix-ui/react-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { generateDates, parseCronExpression } from "cron";
import {
	CalendarIcon,
	ClockIcon,
	DollarSignIcon,
	Edit2Icon,
	ListIcon,
	TagIcon,
	XIcon,
} from "lucide-react";
import React from "react";
import * as List from "./ui/list";

type RecurrentModalProps = {
	recurrence?: Partial<Recurrence>;
};

export function RecurrentModal({
	recurrence,
	children,
	...props
}: RecurrentModalProps & DialogProps) {
	const { formatter } = useLocale();
	return (
		<Dialog.Root {...props}>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content className="fixed inset-0 z-50 h-full bg-background/90 backdrop-blur-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%] flex flex-col">
					<Header>
						<Dialog.Close asChild>
							<Button variant="ghost" size="icon">
								<XIcon />
							</Button>
						</Dialog.Close>
					</Header>
					<Container>
						<List.Root>
							<List.List>
								<SettingItem
									icon={TagIcon}
									color="#8a94ff"
									title="UUID"
									value={recurrence?.uuid ?? "None"}
								/>
								<SettingItem
									icon={ListIcon}
									color="#ffa94d"
									title="Category ID"
									value={recurrence?.categoryId ?? "None"}
								/>
								<SettingItem
									icon={DollarSignIcon}
									color="#6ac77a"
									title="Amount"
									value={<Currency amount={recurrence?.amount ?? 0} />}
								/>
								<SettingItem
									icon={ClockIcon}
									color="#ff8a8a"
									title="Cron"
									value={recurrence?.cron ?? "None"}
								/>
								<SettingItem
									icon={CalendarIcon}
									color="#00aaff"
									title="Start Date"
									value={formatter.dateTime(recurrence?.startDate) ?? "None"}
								/>
								<SettingItem
									icon={CalendarIcon}
									color="#ffaa55"
									title="End Date"
									value={formatter.dateTime(recurrence?.endDate) ?? "None"}
								/>
								<SettingItem
									icon={Edit2Icon}
									color="#ff77cc"
									title="Note"
									value={recurrence?.note ?? "None"}
								/>
							</List.List>
							{recurrence?.cron && <ListRecurrences cron={recurrence.cron} />}
						</List.Root>
					</Container>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

const ListRecurrences = ({ cron }: { cron: string }) => {
	const pageSize = 4;
	const { hasNext, items, nextPage, page } = usePage(
		generateDates(parseCronExpression(cron)),
		pageSize,
	);
	const { formatter } = useLocale();
	return (
		<List.List heading="Next Recurrences">
			{items.map((date, i) => (
				<SettingItem
					key={date.toISOString()}
					icon={CalendarIcon}
					color="#00aaff"
					title={`Recurrence ${(page - 1) * pageSize + i + 1}`}
					value={formatter.dateTime(date, {
						month: "short",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				/>
			))}
			{hasNext && (
				<Button variant="ghost" className="w-full" onClick={() => nextPage()}>
					Show More
				</Button>
			)}
		</List.List>
	);
};
