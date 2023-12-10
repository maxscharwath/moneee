import { memo } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type Category } from '@/stores/schemas/category';

type CategoryChartProps = {
    data: Array<{
        category: Category;
        total: number;
    }>;
    selected?: string;
    onSelect?: (category: string) => void;
};

export const CategoryChart = memo(
    ({ data, selected, onSelect }: CategoryChartProps) => {
        const totalValue = data.reduce((acc, item) => acc + item.total, 0);

        return (
            <div className="space-y-2">
                <ToggleGroup.Root
                    type="single"
                    value={selected}
                    onValueChange={onSelect}
                    className="flex h-6 w-full gap-1"
                >
                    {data.map(({ category, total }) => (
                        <ToggleGroup.Item
                            key={category.uuid}
                            value={category.uuid}
                            style={{
                                width: `${(total / totalValue) * 100}%`,
                                backgroundColor: category.color,
                            }}
                            className={cn(
                                'flex items-center justify-center rounded-md transition-all duration-200',
                                'data-[state=on]:ring-2 data-[state=on]:ring-primary',
                                selected && 'data-[state=off]:opacity-50'
                            )}
                        />
                    ))}
                </ToggleGroup.Root>
                <ToggleGroup.Root
                    type="single"
                    value={selected}
                    onValueChange={onSelect}
                    className="no-scrollbar flex gap-1 overflow-x-auto p-2"
                >
                    {data.map(({ category, total }) => (
                        <ToggleGroup.Item
                            key={category.uuid}
                            value={category.uuid}
                            asChild
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    'flex items-center space-x-2',
                                    'ring-primary/50 data-[state=on]:bg-secondary data-[state=on]:ring'
                                )}
                            >
                                <div
                                    style={{ backgroundColor: category.color }}
                                    className="h-4 w-4 rounded-md"
                                ></div>
                                <span className="truncate font-semibold">
                                    {category.name}
                                </span>
                                <span className="text-sm text-zinc-400">
                                    {Math.round((total / totalValue) * 100)}%
                                </span>
                            </Button>
                        </ToggleGroup.Item>
                    ))}
                </ToggleGroup.Root>
            </div>
        );
    }
);

CategoryChart.displayName = 'CategoryChart';
