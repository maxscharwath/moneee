import { type Database } from '@/stores/db';
import { expenseCategories, incomeCategories } from '@/assets/categories';
import i18n from '@/i18n';

export async function seeder(db: Database) {
    await db.settings.bulkInsert([
        {
            appearance: 'system',
            currency: 'USD',
        },
    ]);

    const t = await i18n;

    const uuids = [
        '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        '9a8b7c6d-5e4f-3a2b-1c0d-e9f8g7h6i5j4',
        '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
        'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e',
        '0f08dcad-cf06-4b8b-8c8b-8b182cfdc34d',
        '48f67c28-4c6a-4bb1-b533-49db0f1a190f',
        '6p5o4n3m-2l1k-0j9i-8h7g-6f5e4d3c2b1a',
        '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
        '5d4c3b2a-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
        '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m',
        '1e9c9877-bca3-4679-8121-6583d8def483',
        'fa5cfa0a-d7c9-4e6b-aa2d-0c5553b9c4e2',
        '1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q',
    ];

    const categories = [...expenseCategories, ...incomeCategories]
        .filter((category) => uuids.includes(category.uuid))
        .map((category) => ({
            ...category,
            name: t(category.name),
        }));

    await db.categories.bulkUpsert(categories);

    await db.transactions.bulkUpsert([
        {
            uuid: 'e3f3d7b2-b0b2-4f5b-9a1a-63de3a4e0bc2',
            note: 'Dinner at Restaurant',
            amount: 150,
            date: genDate('18:30'),
            categoryId: '1e9c9877-bca3-4679-8121-6583d8def483',
        },
        {
            uuid: '4448a0b5-c0d0-4a6a-b344-cdf4442a9a6d',
            note: 'Monthly Train Pass',
            amount: 300,
            date: genDate('09:20'),
            categoryId: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        },
        {
            uuid: '6e5f5033-c9d3-411e-a40f-c2c5db7e6e5f',
            note: 'Cinema',
            amount: 25,
            date: genDate('20:45'),
            categoryId: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m',
        },
        {
            uuid: '3f4d5033-e9d3-511e-b40f-d2d5db7e7e5g',
            note: 'Monthly Salary',
            amount: 7500,
            date: genDate('12:00'),
            categoryId: '6p5o4n3m-2l1k-0j9i-8h7g-6f5e4d3c2b1a',
        },
        {
            uuid: '756f6432-a2d2-411e-b12f-e2c5da6e8e5g',
            note: 'Groceries',
            amount: 180.5,
            date: genDate('17:15'),
            categoryId: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        },
        {
            uuid: '82f654c2-a7e2-411e-a15f-e3c4da7e9e5h',
            note: 'New Shoes',
            amount: 120,
            date: genDate('14:20'),
            categoryId: 'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e',
        },
        {
            uuid: '93a6b532-b7d2-411e-b17f-d3c5dabefe5h',
            note: 'Utilities Bill',
            amount: 200,
            date: genDate('10:05'),
            categoryId: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m',
        },
        {
            uuid: 'a3b6c642-c8d2-411e-c18f-c3c6cabf8e5i',
            note: 'Birthday Gift',
            amount: 50,
            date: genDate('16:45'),
            categoryId: '0f08dcad-cf06-4b8b-8c8b-8b182cfdc34d',
        },
        {
            uuid: 'b3c7d652-d9e2-411e-d19f-b3b7dacf9e5j',
            note: 'Twint to Friend',
            amount: 30,
            date: genDate('11:25'),
            categoryId: '48f67c28-4c6a-4bb1-b533-49db0f1a190f',
        },
        {
            uuid: 'c3d8e662-eaf2-411e-e1af-c3d8eaf2f2k2',
            note: 'Fuel',
            amount: 60,
            date: genDate('09:30'),
            categoryId: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        },
        {
            uuid: 'd3e9f672-fbf2-411e-f1bf-d3e9fbf2g2l2',
            note: 'Gift from Parents',
            amount: 45,
            date: genDate('15:40'),
            categoryId: '1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q',
        },
        {
            uuid: 'f3fb1972-hdh2-411e-h1dh-f3fb1hdi2n2n',
            note: 'Mobile Bill',
            amount: 35,
            date: genDate('12:15'),
            categoryId: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
        },
        {
            uuid: '10ga2a82-idj2-411e-i1ij-10ga2ijj3o3o',
            note: 'Lunch at Work',
            amount: 15,
            date: genDate('13:05'),
            categoryId: '1e9c9877-bca3-4679-8121-6583d8def483',
        },
        {
            uuid: '20hb3b92-jek2-411e-j1jk-20hb3jkj4p4p',
            note: 'Tax Refund',
            amount: 250,
            date: genDate('10:55'),
            categoryId: 'fa5cfa0a-d7c9-4e6b-aa2d-0c5553b9c4e2',
        },
        {
            uuid: '30ic4ca2-kfl2-411e-k1kl-30ic4klk5q5q',
            note: 'Night Out',
            amount: 60,
            date: genDate('21:30'),
            categoryId: '1e9c9877-bca3-4679-8121-6583d8def483',
        },
        {
            uuid: '40jd5db2-lgm2-411e-l1lm-40jd5lml6r6r',
            note: 'Dental Checkup',
            amount: 85,
            date: genDate('15:50'),
            categoryId: '9a8b7c6d-5e4f-3a2b-1c0d-e9f8g7h6i5j4',
        },
        {
            uuid: '50ke6ec2-mhn2-411e-m1mn-50ke6mnm7s7s',
            note: 'Investment Deposit',
            amount: 300,
            date: genDate('16:00'),
            categoryId: '5d4c3b2a-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
        },
        {
            uuid: '70mg8ge2-opq2-411e-o1op-70mg8opo9u9u',
            note: 'Health Insurance',
            amount: 150,
            date: genDate('10:10'),
            categoryId: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
        },
    ]);

    await db.recurrences.bulkUpsert([
        {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            note: 'Monthly Rent',
            amount: 1200,
            startDate: genDate('18:00'),
            cron: '0 0 1 * *',
            categoryId: '6p5o4n3m-2l1k-0j9i-8h7g-6f5e4d3c2b1a',
        },
        {
            uuid: '123e4567-e89b-12d3-a456-426614174001',
            note: 'Weekly Groceries',
            amount: 50,
            startDate: genDate('10:30'),
            cron: '0 10 * * 0',
            categoryId: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        },
        {
            uuid: '123e4567-e89b-12d3-a456-426614174002',
            note: 'Monthly Gym Membership',
            amount: 60,
            startDate: genDate('07:45'),
            cron: '0 7 5 * *',
            categoryId: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        },
        {
            uuid: '123e4567-e89b-12d3-a456-426614174003',
            note: 'Monthly Phone Bill',
            amount: 30,
            startDate: genDate('16:15'),
            cron: '15 16 15 * *',
            categoryId: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
        },
        {
            uuid: '123e4567-e89b-12d3-a456-426614174004',
            note: 'Biweekly Insurance Payment',
            amount: 75,
            startDate: genDate('09:00'),
            cron: '0 9 */14 * *',
            categoryId: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
        },
        {
            uuid: '123e4567-e89b-12d3-a456-426614174005',
            note: 'Quarterly Investment Deposit',
            amount: 500,
            startDate: genDate('11:00'),
            cron: '0 11 1 */3 *',
            categoryId: '5d4c3b2a-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
        },
    ]);
}

function genDate(time: string): string {
    // Create a date for 12 months ago
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 12);

    // Generate a random date between startDate and currentDate
    const randomDate = new Date(
        startDate.getTime() +
            Math.random() * (currentDate.getTime() - startDate.getTime())
    );

    // Set the specific time
    const timeParts = time.split(':');
    randomDate.setHours(
        Number(timeParts[0] ?? 0),
        Number(timeParts[1] ?? 0),
        Number(timeParts[2] ?? 0)
    );

    return randomDate.toISOString();
}
