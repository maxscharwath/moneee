import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ColorInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    color: string;
    onColorChange: (color: string) => void;
}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
    ({ color, onColorChange, className, ...props }, ref) => (
        <label
            className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            style={{ backgroundColor: color }}
        >
            <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                ref={ref}
                {...props}
            />
        </label>
    )
);
ColorInput.displayName = 'ColorInput';

export { ColorInput };
