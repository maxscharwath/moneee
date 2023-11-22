import type React from 'react';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export const Footer: React.FC<
    PropsWithChildren<React.HTMLAttributes<HTMLElement>>
> = ({ children, className }) => (
    <footer
        className={cn(
            'box-content flex h-16 items-center gap-4 bg-background px-4',
            className
        )}
    >
        {children}
    </footer>
);
