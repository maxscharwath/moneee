import {
    type ExtractDocumentTypeFromTypedRxJsonSchema,
    toTypedRxJsonSchema,
} from 'rxdb';

export const RecurrentSchema = toTypedRxJsonSchema({
    title: 'recurrent',
    version: 0,
    type: 'object',
    primaryKey: 'uuid',
    properties: {
        uuid: {
            type: 'string',
            final: true,
        },
        note: {
            type: 'string',
        },
        amount: {
            type: 'number',
        },
        startDate: {
            type: 'string',
            format: 'date-time',
        },
        endDate: {
            type: 'string',
            format: 'date-time',
            nullable: true,
        },
        recurrenceCron: {
            type: 'string',
            description:
                "Cron expression for custom recurrence (e.g., '0 10 * * 1' for every Monday at 10 am).",
            pattern:
                '^([0-5]?\\d)\\s([0-5]?\\d)\\s([01]?\\d|2[0-3])\\s([1-9]|[12]\\d|3[01])\\s([1-9]|1[0-2])\\s([0-6])$',
        },
        categoryId: {
            type: 'string',
            ref: 'categories',
        },
    },
    required: [
        'uuid',
        'note',
        'amount',
        'startDate',
        'recurrenceCron',
        'categoryId',
    ],
    additionalProperties: false,
} as const);

export type Recurrent = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof RecurrentSchema
>;
