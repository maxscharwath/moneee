import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as TabsGroup from '@/components/ui/tabs-group';
import { type Optional } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Header } from '@/components/header';
import { useLocale } from '@/i18n';
import { Category } from '@/stores/schemas/category';
import { Input } from '@/components/ui/input';
import { ColorInput } from '@/components/ui/color-input';
import { EmojiPicker } from '@/components/emoji-picker';

type CategoryModalProps = {
    category?: Partial<Category>;
    onCategory?: (category: Optional<Category, 'uuid'>) => void;
};

function CategoryModalContent({ category, onCategory }: CategoryModalProps) {
    const { t } = useLocale();
    const [type, setType] = React.useState<'income' | 'expense'>(
        category?.type ?? 'expense'
    );
    const [icon, setIcon] = React.useState(category?.icon);
    const [name, setName] = React.useState(category?.name);
    const [color, setColor] = React.useState(category?.color ?? '#ff0000');
    return (
        <div className="flex h-full flex-col">
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
                            setType(t as 'income' | 'expense');
                        }}
                    >
                        <TabsGroup.Item value="income">
                            {t('transaction.income')}
                        </TabsGroup.Item>
                        <TabsGroup.Item value="expense">
                            {t('transaction.expense')}
                        </TabsGroup.Item>
                    </TabsGroup.Root>
                    <div className="flex justify-end" />
                </div>
            </Header>
            <div className="flex grow flex-col gap-4 p-4">
                <div className="flex items-center justify-center py-24">
                    <EmojiPicker selectedEmoji={icon} onEmojiSelect={setIcon} />
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                    <ColorInput color={color} onColorChange={setColor} />
                    <Input
                        type="text"
                        value={name}
                        placeholder={t('category.name')}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        size="icon"
                        onClick={() => {
                            if (!name || !icon || !color) return;
                            onCategory?.({
                                uuid: category?.uuid,
                                type,
                                icon,
                                name,
                                color,
                            });
                        }}
                    >
                        <CheckIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function CategoryModal({
    category,
    onCategory,
    ...props
}: CategoryModalProps & DialogProps) {
    return (
        <Dialog.Root {...props}>
            <Dialog.Portal>
                <Dialog.Content className="fixed inset-0 z-50 h-screen bg-background/90 backdrop-blur-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]">
                    <CategoryModalContent
                        category={category}
                        onCategory={onCategory}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
