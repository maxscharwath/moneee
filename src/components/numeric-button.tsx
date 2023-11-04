import {Button} from '@/components/ui/button.tsx';
import * as React from 'react';
import {type ComponentProps} from 'react';

type NumericButtonProps = {
	value: string;
	hasDecimal: boolean;
	appendToAmount: (value: string) => void;
} & ComponentProps<typeof Button>;

export const NumericButton = React.forwardRef<HTMLButtonElement, NumericButtonProps>(({
	value,
	hasDecimal,
	appendToAmount,
	...props
}, ref) => (
	<Button
		ref={ref}
		variant='secondary'
		size='xl'
		{...props}
		onClick={() => {
			appendToAmount(value);
		}}
		disabled={value === '.' && hasDecimal}
	>
		{value}
	</Button>
));
NumericButton.displayName = 'NumericButton';
