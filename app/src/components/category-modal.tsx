import { Container } from "@/components/container";
import { EmojiPicker } from "@/components/emoji-picker";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/ui/color-input";
import { Input } from "@/components/ui/input";
import * as TabsGroup from "@/components/ui/tabs-group";
import { useLocale } from "@/i18n";
import type { Optional } from "@/lib/utils";
import type { Category } from "@/stores/schemas/category";
import type { DialogProps } from "@radix-ui/react-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import React from "react";

type CategoryModalProps = {
	category?: Partial<Category>;
	defaultType?: "income" | "expense";
	onCategory?: (category: Optional<Category, "uuid">) => void;
	onDelete?: (categoryUuid: string) => void;
};

function CategoryModalContent({
	category,
	onCategory,
	onDelete,
	defaultType = "expense",
}: CategoryModalProps) {
	const { t } = useLocale();
	const [type, setType] = React.useState<"income" | "expense">(
		category?.type ?? defaultType,
	);
	const [icon, setIcon] = React.useState(category?.icon);
	const [name, setName] = React.useState(category?.name);
	const [color, setColor] = React.useState(category?.color ?? "#ff0000");

	const handleDelete = () => {
		if (!category?.uuid) return;
		onDelete?.(category.uuid);
	};

	const handleSave = () => {
		if (!name || !icon || !color) return;
		onCategory?.({
			uuid: category?.uuid,
			type,
			icon,
			name,
			color,
		});
	};

	return (
		<>
			<Header>
				<div className="grid w-full grid-cols-[1fr,auto,1fr] items-center gap-4">
					<Dialog.Close asChild>
						<Button variant="ghost" size="icon">
							<XIcon />
						</Button>
					</Dialog.Close>
					<TabsGroup.Root
						value={type}
						onValueChange={(t) => {
							setType(t as "income" | "expense");
						}}
					>
						<TabsGroup.Item value="income">
							{t("transaction.income")}
						</TabsGroup.Item>
						<TabsGroup.Item value="expense">
							{t("transaction.expense")}
						</TabsGroup.Item>
					</TabsGroup.Root>
					<div className="flex justify-end">
						{category?.uuid && (
							<Button size="icon" variant="destructive" onClick={handleDelete}>
								<Trash2Icon />
							</Button>
						)}
					</div>
				</div>
			</Header>
			<Container>
				<div className="flex items-center justify-center py-24">
					<EmojiPicker selectedEmoji={icon} onEmojiSelect={setIcon} />
				</div>
				<div className="flex flex-row items-center justify-center gap-2">
					<ColorInput color={color} onColorChange={setColor} />
					<Input
						type="text"
						value={name}
						placeholder={t("category.name")}
						onChange={(e) => setName(e.target.value)}
					/>
					<Button size="icon" onClick={handleSave}>
						<CheckIcon />
					</Button>
				</div>
			</Container>
		</>
	);
}

export function CategoryModal({
	category,
	onCategory,
	onDelete,
	defaultType,
	children,
	...props
}: CategoryModalProps & DialogProps) {
	return (
		<Dialog.Root {...props}>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content className="fixed inset-0 z-50 h-screen bg-background/90 backdrop-blur-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]">
					<CategoryModalContent
						category={category}
						onCategory={onCategory}
						onDelete={onDelete}
						defaultType={defaultType}
					/>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
