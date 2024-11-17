import { Container } from "@/components/container";
import { Header, HeaderTitle } from "@/components/header";
import { Button } from "@/components/ui/button";
import * as List from "@/components/ui/list";
import { useLocale } from "@/i18n";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckIcon, ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Component() {
	const { t, i18n, language, languages } = useLocale();

	const handleLanguageChange = (lang: string) => {
		void i18n.changeLanguage(lang);
	};

	return (
		<>
			<Header>
				<Button variant="ghost" size="icon" asChild>
					<NavLink
						to="/settings"
						className="flex items-center gap-2"
						state={{ direction: "left" }}
					>
						<ChevronLeft />
					</NavLink>
				</Button>
				<HeaderTitle>{t("settings.language.title")}</HeaderTitle>
			</Header>
			<Container>
				<RadioGroup.Root
					value={language?.code}
					onValueChange={handleLanguageChange}
				>
					<List.Root>
						<List.List>
							{languages.map(({ icon, code }) => (
								<RadioGroup.Item asChild value={code} key={code}>
									<List.ItemButton>
										<List.ItemIcon>{icon}</List.ItemIcon>
										<span className="truncate">{t(`languages.${code}`)}</span>
										<RadioGroup.Indicator asChild>
											<CheckIcon className="ml-auto shrink-0" />
										</RadioGroup.Indicator>
									</List.ItemButton>
								</RadioGroup.Item>
							))}
						</List.List>
					</List.Root>
				</RadioGroup.Root>
			</Container>
		</>
	);
}

Component.displayName = "Settings.Language";
