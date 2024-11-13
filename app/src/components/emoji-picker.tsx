import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger, } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAsync } from '@/hooks/useAsync'
import { lazyInitialize } from '@/stores/utils/createDatabase'
import {
	CarIcon,
	FlagIcon,
	MedalIcon,
	PawPrintIcon,
	PiIcon,
	PizzaIcon,
	ShirtIcon,
	SmileIcon,
	SmilePlusIcon,
} from 'lucide-react'
import React, { useMemo } from 'react'

type EmojiPickerProps = {
	selectedEmoji?: string;
	onEmojiSelect?: (emoji: string) => void;
};

type Category = {
	id: string;
	name: string;
	icon: React.ReactNode;
};

const categories = [
	{
		id: "smileys_people",
		name: "Smileys, Emotion & People",
		icon: <SmileIcon />,
	},
	{
		id: "animals_nature",
		name: "Animals & Nature",
		icon: <PawPrintIcon />,
	},
	{
		id: "food_drink",
		name: "Food & Drink",
		icon: <PizzaIcon />,
	},
	{
		id: "travel_places",
		name: "Travel & Places",
		icon: <CarIcon />,
	},
	{
		id: "activities",
		name: "Activities",
		icon: <MedalIcon />,
	},
	{
		id: "objects",
		name: "Objects",
		icon: <ShirtIcon />,
	},
	{
		id: "symbols",
		name: "Symbols",
		icon: <PiIcon />,
	},
	{
		id: "flags",
		name: "Flags",
		icon: <FlagIcon />,
	},
] satisfies Category[];

const initEmojis = lazyInitialize(
	async () => (await import("@/assets/emoji.json")).default,
);

export const EmojiPicker = ({
	selectedEmoji,
	onEmojiSelect,
}: EmojiPickerProps) => {
	const { data } = useAsync(initEmojis);

	const [category, setCategory] = React.useState<string | undefined>();

	const emojis = useMemo(
		() => data?.filter((emoji) => !category || emoji.category === category),
		[data, category],
	);

	return (
		<Drawer>
			<DrawerTrigger className="flex h-24 w-24 items-center justify-center rounded-xl bg-secondary p-1 text-[3rem] ring ring-primary/50">
				{selectedEmoji ?? <SmilePlusIcon size="3rem" />}
			</DrawerTrigger>
			<DrawerContent className="m-auto max-h-[50vh] w-full max-w-lg">
				<DrawerHeader>
					<ToggleGroup
						type="single"
						defaultValue={category}
						onValueChange={setCategory}
					>
						{categories?.map(({ id, name, icon }) => (
							<ToggleGroupItem
								key={id}
								value={id}
								aria-label={name}
								size="sm"
								className="grow"
							>
								{icon}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</DrawerHeader>
				<Separator />
				<ToggleGroup
					className="grid grid-cols-5 overflow-y-auto p-1"
					type="single"
					defaultValue={selectedEmoji}
					onValueChange={(emoji) => emoji && onEmojiSelect?.(emoji)}
				>
					{emojis?.map(({ emoji, description }) => (
						<ToggleGroupItem
							key={`${emoji}-${description}`}
							value={emoji}
							size="xl"
							aria-label={description}
						>
							{emoji}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</DrawerContent>
		</Drawer>
	);
};
