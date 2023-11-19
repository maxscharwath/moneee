import type React from 'react';
import {type HTMLAttributes, type PropsWithoutRef, useEffect} from 'react';
import {
	motion,
	type MotionProps,
	type MotionValue,
	useMotionValue,
	useSpring,
	useTransform,
} from 'framer-motion';
import {useLocale} from '@/i18n';

type HTMLAttributesWithoutMotionProps<Element extends HTMLElement, Attributes extends HTMLAttributes<Element> = HTMLAttributes<Element>> = {
	[K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K];
};

type CurrencyProps = {
	amount: number;
	signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
} & PropsWithoutRef<HTMLAttributesWithoutMotionProps<HTMLSpanElement>>;

export const Currency: React.FC<CurrencyProps> = ({
	amount,
	signDisplay,
	...props
}) => {
	const {formatter} = useLocale();
	const motionValue = useMotionValue(amount);

	const springValue = useSpring(motionValue, {
		duration: 250,
	}) as MotionValue<number>;

	const formattedValue = useTransform(
		springValue,
		value => formatter.currency(value, {
			signDisplay,
		}),
	);

	useEffect(() => {
		motionValue.set(amount);
	}, [amount, motionValue]);

	return (
		<motion.span {...props}>
			{formattedValue}
		</motion.span>
	);
};
