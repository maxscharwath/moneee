import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4', {
    variants: {
        align: {
            default:
                '[&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
            center: 'flex flex-col items-center [&>svg]:mx-auto [&>svg]:h-10 [&>svg]:w-10 [&>svg~*]:mt-2',
        },
        variant: {
            default: 'bg-background text-foreground',
            destructive:
                'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        },
    },
    defaultVariants: {
        variant: 'default',
        align: 'default',
    },
});

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, align, ...props }, ref) => (
    <div
        ref={ref}
        role="alert"
        className={cn(
            alertVariants({
                variant,
                align,
            }),
            className
        )}
        {...props}
    />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn(
            'mb-1 font-medium leading-none tracking-tight',
            className
        )}
        {...props}
    />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('text-sm [&_p]:leading-relaxed', className)}
        {...props}
    />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
