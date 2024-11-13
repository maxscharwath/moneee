import {
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	toTypedRxJsonSchema,
} from "rxdb";

export const SettingsSchema = toTypedRxJsonSchema({
	title: "settings",
	version: 0,
	type: "object",
	primaryKey: "id",
	properties: {
		id: {
			type: "string",
			default: "settings",
			final: true,
		},
		appearance: {
			type: "string",
			enum: ["light", "dark", "system"],
		},
		currency: {
			type: "string",
			pattern: "^[A-Z]{3}$",
		},
	},
	required: ["appearance", "currency"],
} as const);

export type Settings = ExtractDocumentTypeFromTypedRxJsonSchema<
	typeof SettingsSchema
>;
