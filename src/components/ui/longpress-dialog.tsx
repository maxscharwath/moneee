import React, { createContext, useContext, useState } from 'react';
import { type LongPressFns, useLongPress } from '@uidotdev/usehooks';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Popover, PopoverAnchor } from '@/components/ui/popover';
import * as PopoverPrimitive from '@radix-ui/react-popover';

const LongPressContext = createContext<{
    longPressState: 'normal' | 'pending' | 'pressed';
    attrs: LongPressFns;
} | null>(null);

const useLongPressContext = () => {
    const context = useContext(LongPressContext);
    if (!context) {
        throw new Error(
            'useLongPressContext must be used within a LongPressProvider'
        );
    }

    return context;
};

export const Root: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [longPressState, setLongPressState] = useState<
        'normal' | 'pending' | 'pressed'
    >('normal');

    const attrs = useLongPress(() => setLongPressState('pressed'), {
        onStart: () => setLongPressState('pending'),
        onCancel: () => setLongPressState('normal'),
        threshold: 1000,
    });

    return (
        <LongPressContext.Provider
            value={{
                longPressState,
                attrs,
            }}
        >
            <DialogPrimitive.Root
                open={longPressState === 'pressed'}
                onOpenChange={(open) => !open && setLongPressState('normal')}
            >
                <Popover open={true}>{children}</Popover>
            </DialogPrimitive.Root>
        </LongPressContext.Provider>
    );
};

export const Trigger: React.FC<
    React.PropsWithChildren<{ asChild?: boolean }>
> = ({ asChild, children }) => {
    const Comp = asChild ? Slot : 'span';
    const { longPressState, attrs } = useLongPressContext();
    return (
        <PopoverAnchor asChild>
            <Comp
                data-state={longPressState}
                className={cn(
                    'transition-all duration-200',
                    longPressState === 'pending' &&
                        'scale-95 delay-500 duration-500',
                    longPressState !== 'normal' && 'z-20',
                    longPressState === 'pressed' && 'border shadow-lg'
                )}
                {...attrs}
            >
                {children}
            </Comp>
        </PopoverAnchor>
    );
};

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            side="top"
            className={cn(
                'z-50 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export const Content: React.FC<
    React.ComponentPropsWithoutRef<typeof PopoverContent>
> = (props) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-10 bg-background/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content asChild>
            <PopoverContent {...props} />
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
);
