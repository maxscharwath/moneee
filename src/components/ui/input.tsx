import * as React from 'react';
import {cn} from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: React.ReactNode; // Added icon prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({
		className,
		type,
		icon,
		...props
	}, ref) => (
		<label className='relative flex items-center'>
			{/* Render icon if provided */}
			{icon && <div
				className='absolute inset-y-0 left-3 flex items-center text-muted-foreground'>{icon}</div>}

			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
					icon && 'pl-10',
					className,
				)}
				ref={ref}
				{...props}
			/>
		</label>
	),
);
Input.displayName = 'Input';

export {Input};
