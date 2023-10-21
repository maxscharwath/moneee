import React from 'react';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select.tsx';

type HeaderProps = {
	title: string;
	defaultValue?: 'weekly' | 'monthly' | 'yearly';
};

export const Header: React.FC<HeaderProps> = ({title, defaultValue}) => (
	<nav className='sticky top-0 z-10 flex items-center justify-between p-4 bg-background shadow-md portrait:standalone:pt-14'>
		<h1 className='font-bold text-2xl'>{title}</h1>
		<Select defaultValue={defaultValue}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select period'/>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='weekly'>Weekly</SelectItem>
				<SelectItem value='monthly'>Monthly</SelectItem>
				<SelectItem value='yearly'>Yearly</SelectItem>
			</SelectContent>
		</Select>
	</nav>
);
