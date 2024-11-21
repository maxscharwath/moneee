import { useRegisterSW } from "virtual:pwa-register/react";
import { Container } from "@/components/container";
import { Header, HeaderTitle } from "@/components/header";
import { SettingItem } from "@/components/settings-item";
import * as List from "@/components/ui/list";
import * as TabsGroup from "@/components/ui/tabs-group";
import { useSettings } from "@/hooks/useSettings";
import { useLocale } from "@/i18n";
import { exportToCsv } from "@/lib/exportTransactions";
import { initializeDb } from "@/stores/db";
import { CategorySchema } from "@/stores/schemas/category";
import { TransactionSchema } from "@/stores/schemas/transaction";
import { abbreviatedSha } from "@build/info";
import { version } from "@build/package";
import {
	CloudIcon,
	CoinsIcon,
	ContrastIcon,
	DownloadIcon,
	Info,
	LanguagesIcon,
	LayoutGridIcon,
	MonitorIcon,
	MoonIcon,
	RotateCwIcon,
	SaveIcon,
	SunIcon,
	Trash2Icon,
	UploadIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function Component() {
	const { t, language } = useLocale();

	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW();

	const [settings, setSettings] = useSettings();

	return (
		<>
			<Header>
				<HeaderTitle>{t("settings.root.title")}</HeaderTitle>
			</Header>
			<Container>
				<div className="min-h-full">
					<List.Root>
						<List.List heading={t("settings.root.general")}>
							<SettingItem
								icon={ContrastIcon}
								color="#89cff0"
								title={t("settings.root.appearance")}
							>
								<TabsGroup.Root
									size="sm"
									value={settings?.appearance ?? "system"}
									onValueChange={(value) =>
										setSettings({
											appearance: value as "light" | "dark" | "system",
										})
									}
								>
									<TabsGroup.Item value="light" asChild>
										<SunIcon />
									</TabsGroup.Item>
									<TabsGroup.Item value="dark" asChild>
										<MoonIcon />
									</TabsGroup.Item>
									<TabsGroup.Item value="system" asChild>
										<MonitorIcon />
									</TabsGroup.Item>
								</TabsGroup.Root>
							</SettingItem>

							<SettingItem
								icon={CoinsIcon}
								color="#ffb6c1"
								title={t("settings.root.currency")}
								href="/settings/currency"
								value={settings?.currency}
								chevron
							/>

							<SettingItem
								icon={LanguagesIcon}
								color="#5a96ee"
								title={t("settings.root.language")}
								href="/settings/language"
								value={
									<>
										{language?.icon} {language?.name}
									</>
								}
								chevron
							/>

							<SettingItem
								icon={LayoutGridIcon}
								color="#c3aed6"
								title={t("settings.root.categories")}
								href="/settings/categories"
								chevron
							/>

							<SettingItem
								icon={RotateCwIcon}
								color="#ffcc5c"
								title={t("settings.root.recurrences")}
								href="/settings/recurrences"
								chevron
							/>

							<SettingItem
								icon={Info}
								color="#a8aeb3"
								title={t("settings.root.about")}
								href="/settings/about"
								chevron
							/>
						</List.List>
						<List.List heading={t("settings.root.data")}>
							<SettingItem
								icon={UploadIcon}
								color="#77dd77"
								title={t("settings.root.export")}
								action={exportToCsv}
								chevron
							/>

							<SettingItem
								icon={DownloadIcon}
								color="#ffcc5c"
								title={t("settings.root.import")}
								chevron
							/>

							<SettingItem
								icon={Trash2Icon}
								color="#ff6961"
								title={t("settings.root.erase.title")}
								alert={{
									title: t("settings.root.erase.alert.title"),
									description: t("settings.root.erase.alert.description"),
									confirmText: t("settings.root.erase.alert.confirm"),
									cancelText: t("settings.root.erase.alert.cancel"),
									onConfirm: resetDb,
								}}
								chevron
							/>

							<SettingItem
								icon={CloudIcon}
								color="#b19cd9"
								title={t("settings.root.synchronisation")}
								href="/settings/synchronisation"
								chevron
							/>

							<SettingItem
								icon={SaveIcon}
								color="#ffb347"
								title={t("settings.root.refreshCache")}
								action={async () => updateServiceWorker(true)}
								value={
									needRefresh
										? t("settings.cache.newVersionAvailable")
										: t("settings.cache.upToDate")
								}
								chevron
							/>
						</List.List>
					</List.Root>
				</div>
				<NavLink
					to="/settings/about"
					className="mt-4 flex justify-center gap-2"
					state={{ direction: "right" }}
				>
					<span className="text-xs font-bold text-muted-foreground">
						{t("settings.version", { version })}
					</span>
					<span className="text-xs font-bold text-muted-foreground">
						{t("settings.build", { build: abbreviatedSha })}
					</span>
				</NavLink>
			</Container>
		</>
	);
}

Component.displayName = "Settings.Root";

const resetDb = async () => {
	const db = await initializeDb();
	await db.transactions.remove();
	await db.categories.remove();
	await db.addCollections({
		transactions: {
			schema: TransactionSchema,
		},
		categories: {
			schema: CategorySchema,
		},
	});
};
