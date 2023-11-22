import {
    type ExtractDocumentTypeFromTypedRxJsonSchema,
    toTypedRxJsonSchema,
} from 'rxdb';

export const CategorySchema = toTypedRxJsonSchema({
    title: 'category',
    version: 0,
    type: 'object',
    primaryKey: 'uuid',
    properties: {
        uuid: {
            type: 'string',
            final: true,
        },
        name: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        icon: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: ['expense', 'income'],
            final: true,
        },
    },
    required: ['uuid', 'name', 'color', 'icon', 'type'],
    indexes: [['type', 'name']],
} as const);

export type Category = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof CategorySchema
>;
