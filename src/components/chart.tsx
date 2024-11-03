import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { memo, useMemo } from 'react';
import { Category } from '@/stores/schemas/category';

export type ChartData = {
    name: string;
    total: number;
    categories: {
        category: Category; // color, name, icon
        total: number;
    }[];
};

export type ChartProps = {
    data: ChartData[];
};

const useTransformedData = (data: ChartData[]) =>
    useMemo(
        () =>
            data.map((period) => {
                const categoryTotals = period.categories
                    .sort((a, b) => b.total - a.total)
                    .reduce(
                        (acc, { category, total }) => {
                            const compositeKey = getCompositeKey(
                                period.name,
                                category.name
                            );
                            acc[compositeKey] = {
                                total,
                                category,
                            };
                            return acc;
                        },
                        {} as Record<
                            string,
                            {
                                total: number;
                                category: Category;
                            }
                        >
                    );

                return {
                    ...period,
                    ...categoryTotals,
                };
            }),
        [data]
    );

export const Chart = memo(({ data }: ChartProps) => {
    const transformedData = useTransformedData(data);

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={transformedData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickCount={30}
                    minTickGap={20}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                        (value >= 1000
                            ? `${value / 1000}K`
                            : value
                        ).toLocaleString('fr-CH')
                    }
                    tickCount={3}
                />

                {transformedData.flatMap((period) =>
                    period.categories.map((categoryData, index) => {
                        const compositeKey = getCompositeKey(
                            period.name,
                            categoryData.category.name
                        );
                        const isTop = index === period.categories.length - 1;
                        return (
                            <Bar
                                key={compositeKey}
                                dataKey={`${compositeKey}.total`}
                                name={categoryData.category.name}
                                fill={categoryData.category.color}
                                stackId="a"
                                radius={isTop ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                            />
                        );
                    })
                )}
            </BarChart>
        </ResponsiveContainer>
    );
});

Chart.displayName = 'Chart';

const getCompositeKey = (...args: string[]) =>
    args.map((arg) => arg.replace(/[^a-zA-Z0-9]/g, '')).join('-');
