import { useAsync } from '@/lib/utils';
import React, { useMemo } from 'react';
import {
    DialogContent,
    DialogRoot,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    CarIcon,
    FlagIcon,
    MedalIcon,
    PawPrintIcon,
    PiIcon,
    PizzaIcon,
    ShirtIcon,
    SmileIcon,
} from 'lucide-react';
import { lazyInitialize } from '@/stores/utils/createDatabase';

type EmojiPickerProps = {
    selectedEmoji: string;
    onEmojiSelect: (emoji: string) => void;
};

type Category = {
    id: string;
    name: string;
    icon: React.ReactNode;
};

const categories = [
    {
        id: 'smileys_people',
        name: 'Smileys, Emotion & People',
        icon: <SmileIcon />,
    },
    {
        id: 'animals_nature',
        name: 'Animals & Nature',
        icon: <PawPrintIcon />,
    },
    {
        id: 'food_drink',
        name: 'Food & Drink',
        icon: <PizzaIcon />,
    },
    {
        id: 'travel_places',
        name: 'Travel & Places',
        icon: <CarIcon />,
    },
    {
        id: 'activities',
        name: 'Activities',
        icon: <MedalIcon />,
    },
    {
        id: 'objects',
        name: 'Objects',
        icon: <ShirtIcon />,
    },
    {
        id: 'symbols',
        name: 'Symbols',
        icon: <PiIcon />,
    },
    {
        id: 'flags',
        name: 'Flags',
        icon: <FlagIcon />,
    },
] satisfies Category[];

const initEmojis = lazyInitialize(
    async () => (await import('@/assets/emoji.json')).default
);

export const EmojiPicker = ({
    selectedEmoji,
    onEmojiSelect,
}: EmojiPickerProps) => {
    const { data } = useAsync(initEmojis);

    const [category, setCategory] = React.useState<string | undefined>();

    const emojis = useMemo(
        () => data?.filter((emoji) => !category || emoji.category === category),
        [data, category]
    );

    return (
        <DialogRoot>
            <DialogTrigger className="flex h-24 w-24 items-center justify-center rounded-xl bg-secondary p-1 text-[3rem] ring ring-primary/50">
                {selectedEmoji}
            </DialogTrigger>
            <DialogContent className="max-h-[50vh]">
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
                <ToggleGroup
                    className="grid grid-cols-5 overflow-y-auto"
                    type="single"
                    defaultValue={selectedEmoji}
                    onValueChange={onEmojiSelect}
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
            </DialogContent>
        </DialogRoot>
    );
};
