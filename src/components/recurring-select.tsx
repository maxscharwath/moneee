import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { memo } from 'react';
import { RotateCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecurringDailyIcon } from '@/components/icons/RecurringDailyIcon';
import { RecurringWeaklyIcon } from '@/components/icons/RecurringWeeklyIcon';
import { RecurringYearlyIcon } from '@/components/icons/RecurringYearlyIcon';
import { RecurringCustomIcon } from '@/components/icons/RecurringCustomIcon';
import { RecurringMonthlyIcon } from '@/components/icons/RecurringMonthlyIcon';
import { useLocale } from '@/i18n';

type RecurringSelectProps = {
    value?: Recurring;
    onValueChange?: (value: Recurring) => void;
};

const recurring = {
    none: {
        label: 'None',
        icon: <RotateCwIcon />,
    },
    daily: {
        label: 'Daily',
        icon: <RecurringDailyIcon />,
    },
    weekly: {
        label: 'Weekly',
        icon: <RecurringWeaklyIcon />,
    },
    monthly: {
        label: 'Monthly',
        icon: <RecurringMonthlyIcon />,
    },
    yearly: {
        label: 'Yearly',
        icon: <RecurringYearlyIcon />,
    },
    custom: {
        label: 'Custom',
        icon: <RecurringCustomIcon />,
    },
} as const;

export type Recurring = keyof typeof recurring;

export const RecurringSelect = memo(
    ({ value, onValueChange }: RecurringSelectProps) => {
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
                            {recurring[value ?? 'none'].icon}
                        </SelectPrimitive.Value>
                    </Button>
                </SelectPrimitive.Trigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="none">{t('recurring.none')}</SelectItem>
                    <SelectItem value="daily">
                        {t('recurring.daily')}
                    </SelectItem>
                    <SelectItem value="weekly">
                        {t('recurring.weekly')}
                    </SelectItem>
                    <SelectItem value="monthly">
                        {t('recurring.monthly')}
                    </SelectItem>
                    <SelectItem value="yearly">
                        {t('recurring.yearly')}
                    </SelectItem>
                    <SelectItem value="custom">
                        {t('recurring.custom')}
                    </SelectItem>
                </SelectContent>
            </Select>
        );
    }
);

RecurringSelect.displayName = 'RecurrenceSelect';
