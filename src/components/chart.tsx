import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {memo} from 'react';

type ChartProps = {
	data: Array<{
		name: string;
		total: number;
	}>;
};

export const Chart = memo(({data}: ChartProps) => (
	<ResponsiveContainer width='100%' height={200}>
		<BarChart data={data}>
			<XAxis
				dataKey='name'
				stroke='#888888'
				fontSize={12}
				tickLine={false}
				axisLine={false}
				tickCount={30}
				minTickGap={20}
			/>
			<YAxis
				stroke='#888888'
				fontSize={12}
				tickLine={false}
				axisLine={false}
				tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}K` : value).toLocaleString('fr-CH')}
				tickCount={3}
			/>
			<Bar dataKey='total' fill='#adfa1d' radius={[4, 4, 0, 0]}/>
		</BarChart>
	</ResponsiveContainer>
));

Chart.displayName = 'Chart';
