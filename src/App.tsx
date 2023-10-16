import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { ArrowDownRight, ArrowUpRight, RotateCw } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
const categories = [
  { type: 'income', name: 'Salary', icon: '💰', color: '#10B981', id: 1 },
  { type: 'expense', name: 'Rent', icon: '🏠', color: '#F87171', id: 2 },
  { type: 'expense', name: 'Groceries', icon: '🍎', color: '#bb2cb9', id: 3 },
  { type: 'expense', name: 'Entertainment', icon: '🎉', color: '#FBBF24', id: 4 },
  { type: 'expense', name: 'Travel', icon: '✈️', color: '#FBBF24', id: 5 },
  { type: 'expense', name: 'Health', icon: '🏥', color: '#F87171', id: 6 },
  { type: 'expense', name: 'Other', icon: '📦', color: '#F87171', id: 7 },
  { type: 'expense', name: 'Transport', icon: '🚗', color: '#5A61F6', id: 8 },
];

function App() {
  const transactions = [
    {
      id: 1,
      name: 'Salary',
      amount: 5700,
      date: '2021-01-01',
      categoryId: 1,
      recurrence: 'monthly',
    },
    {
      id: 2,
      name: 'Rent',
      amount: 1200,
      date: '2021-01-01',
      categoryId: 2,
      recurrence: 'monthly',
    },
    {
      id: 3,
      name: 'Groceries',
      amount: 300,
      date: '2021-01-01',
      categoryId: 3,
    },
    {
      id: 4,
      name: 'Entertainment',
      amount: 200,
      date: '2021-01-01',
      categoryId: 4,
    },
    {
      id: 5,
      name: 'Travel',
      amount: 100,
      date: '2021-01-01',
      categoryId: 5,
    },
    {
      id: 6,
      name: 'Health',
      amount: 200,
      date: '2021-01-01',
      categoryId: 6,
      recurrence: 'monthly',
    },
    {
      id: 7,
      name: 'Other',
      amount: 200,
      date: '2021-01-01',
      categoryId: 7,
    },
    {
      id: 8,
      name: 'Transport',
      amount: 110,
      date: '2021-01-01',
      categoryId: 8,
      recurrence: 'weekly'
    }
  ];

  const total = transactions.reduce(
    (acc, transaction) =>
      acc + transaction.amount * (categories.find((category) => category.id === transaction.categoryId)?.type === 'expense' ? -1 : 1),
    0
  );

  const [totalIncome, totalExpenses] = transactions.reduce(
    (acc, transaction) => {
      const type = categories.find((category) => category.id === transaction.categoryId)?.type
      return type === 'expense' ? [acc[0], acc[1] + transaction.amount] : [acc[0] + transaction.amount, acc[1]]
    }, [0, 0]);

  const data = Array.from({ length: 31 }, (_, i) => {
    const date = new Date('2021-01-01');
    date.setDate(i + 1);
    return {
      name: date.toLocaleDateString('fr-CH', { day: '2-digit' }),
      total: Math.floor(Math.random() * 10000),
    };
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 rounded-md border p-2 bg-secondary flex-grow">
          <Avatar>
            <AvatarFallback  className="bg-green-500">
              <ArrowUpRight size={24}/>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
          <span className="">Income</span>
          <span className="font-bold text-xl text-green-500">{totalIncome.toLocaleString('fr-CH', {
            style: 'currency',
            currency: 'CHF',
          })}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-2 bg-secondary flex-grow">
          <Avatar>
            <AvatarFallback  className="bg-red-500">
              <ArrowDownRight size={24}/>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
          <span className="">Expenses</span>
          <span className="font-bold text-xl text-red-500">{totalExpenses.toLocaleString('fr-CH', {
            style: 'currency',
            currency: 'CHF',
          })}</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
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
            // if more than 1000 then divide by 1000 and add K after the number
            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}K` : value).toLocaleString('fr-CH')}
            tickCount={3}
          />
          <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    <div className="flex items-center justify-between">
      <span className="font-bold text-2xl">October 2023</span>
      <span className="font-bold text-2xl">
        {total.toLocaleString('fr-CH', {
          style: 'currency',
          currency: 'CHF',
        })}
      </span>
    </div>
      <Separator className="my-4"/>
    <ul className="space-y-2">
      {transactions.map((transaction) => {
        const category = categories.find(
          (category) => category.id === transaction.categoryId
        );
        return (
          <li
            key={transaction.id}
            className="flex items-center space-x-2 rounded-md border p-2"
          >
            <Avatar>
              <AvatarFallback style={{ backgroundColor: category?.color }} className='text-xl'>
                {category?.icon}
              </AvatarFallback>
              {transaction.recurrence && (
                <div className="absolute bottom-0 right-0 text-xs rounded-xl p-1 transform translate-x-1/4 translate-y-1/4 backdrop-blur-sm border bg-background/50">
                  <RotateCw size={12}/>
                </div>
              )}
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-bold">{transaction.name}</h3>
              <time className="text-sm text-gray-500">
                {transaction.date}
              </time>
            </div>
            <span
              className="font-bold flex-grow text-right"
            >
              {(transaction.amount * (category?.type === 'expense' ? -1 : 1)).toLocaleString( 'fr-CH', {
                style: 'currency',
                currency: 'CHF',
              })}
            </span>
          </li>
        );
      })}
    </ul>
    </div>
  )
}

export default App
