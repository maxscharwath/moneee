import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { memo } from 'react';
import { RotateCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecurringDailyIcon } from '@/components/icons/RecurringDailyIcon';
import { RecurringWeaklyIcon } from '@/components/icons/RecurringWeeklyIcon';
import { RecurringYearlyIcon } from '@/components/icons/RecurringYearlyIcon';
import { RecurringMonthlyIcon } from '@/components/icons/RecurringMonthlyIcon';
import { useLocale } from '@/i18n';

type RecurrenceSelectProps = {
    value?: RecurrenceType;
    onValueChange?: (value: RecurrenceType) => void;
};

const recurrences = {
    none: {
        icon: <RotateCwIcon />,
    },
    daily: {
        icon: <RecurringDailyIcon />,
    },
    weekly: {
        icon: <RecurringWeaklyIcon />,
    },
    monthly: {
        icon: <RecurringMonthlyIcon />,
    },
    yearly: {
        icon: <RecurringYearlyIcon />,
    },
} as const;

export type RecurrenceType = keyof typeof recurrences;

export const RecurrenceSelect = memo(
    ({ value, onValueChange }: RecurrenceSelectProps) => {
        const { t } = useLocale();
        return (
            <Select
                onValueChange={onValueChange}
                value={value}
                defaultValue="none"
            >
                <SelectPrimitive.Trigger className="flex items-center justify-end">
                    <Button size="icon" variant="ghost">
                        <SelectPrimitive.Value asChild>
                            {recurrences[value ?? 'none'].icon}
                        </SelectPrimitive.Value>
                    </Button>
                </SelectPrimitive.Trigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="none">{t('recurrence.none')}</SelectItem>
                    <SelectItem value="daily">
                        {t('recurrence.daily')}
                    </SelectItem>
                    <SelectItem value="weekly">
                        {t('recurrence.weekly')}
                    </SelectItem>
                    <SelectItem value="monthly">
                        {t('recurrence.monthly')}
                    </SelectItem>
                    <SelectItem value="yearly">
                        {t('recurrence.yearly')}
                    </SelectItem>
                </SelectContent>
            </Select>
        );
    }
);

RecurrenceSelect.displayName = 'RecurrenceSelect';
