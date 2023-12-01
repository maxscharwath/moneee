import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { memo } from 'react';
import { RotateCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RecurrenceSelectProps = {
    value?: string;
    onValueChange?: (value: string) => void;
};

export const RecurrenceSelect = memo(
    ({ value, onValueChange }: RecurrenceSelectProps) => {
        return (
            <Select
                onValueChange={onValueChange}
                value={value}
                defaultValue="none"
            >
                <SelectPrimitive.Trigger className="flex items-center justify-end">
                    <Button size="icon" variant="ghost">
                        <SelectPrimitive.Value>
                            <RotateCwIcon />
                        </SelectPrimitive.Value>
                    </Button>
                </SelectPrimitive.Trigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
            </Select>
        );
    }
);

RecurrenceSelect.displayName = 'RecurrenceSelect';
