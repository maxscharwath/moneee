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
import {useSettings} from '@/stores/db.ts';

type HTMLAttributesWithoutMotionProps<Element extends HTMLElement, Attributes extends HTMLAttributes<Element> = HTMLAttributes<Element>> = {
	[K in Exclude<keyof Attributes, keyof MotionProps>]?: Attributes[K];
};

type CurrencyProps = {
	amount: number;
	locale?: string;
	currency?: string;
	signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
} & PropsWithoutRef<HTMLAttributesWithoutMotionProps<HTMLSpanElement>>;

const Currency: React.FC<CurrencyProps> = ({
	amount,
	locale = 'en-US',
	signDisplay,
	...props
}) => {
	const [settings] = useSettings();
	const currency = settings?.currency ?? 'USD';
	const motionValue = useMotionValue(amount);

	const springValue = useSpring(motionValue, {
		duration: 250,
	}) as MotionValue<number>;

	const formattedValue = useTransform(
		springValue,
		value => value.toLocaleString(locale, {
			style: 'currency',
			signDisplay,
			currency,
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

export default Currency;
