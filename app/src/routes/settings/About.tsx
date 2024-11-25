import logo from "@/assets/logo.webp";
import { Container } from "@/components/container";
import { Header, HeaderTitle } from "@/components/header";
import { SettingItem } from "@/components/settings-item";
import { Button } from "@/components/ui/button";
import * as List from "@/components/ui/list";
import { useLocale } from "@/i18n";
import { abbreviatedSha, github } from "@build/info";
import { contributors, license, version } from "@build/package";
import now from "@build/time";
import { SiBluesky, SiGithub } from "@icons-pack/react-simple-icons";
import {
	AtSignIcon,
	Bug,
	Calendar,
	ChevronLeft,
	Code2Icon,
	GlobeIcon,
	Hash,
	Package,
	Shield,
	User,
} from "lucide-react";
import type React from "react";
import { NavLink } from "react-router-dom";
import { getPastelColorFromHash } from "@/lib/utils";

const socialPlatforms: Record<
	string,
	{ icon: React.ReactNode; linkPrefix?: string }
> = {
	email: { icon: <AtSignIcon />, linkPrefix: "mailto:" },
	bluesky: { icon: <SiBluesky /> },
	github: { icon: <SiGithub /> },
	website: { icon: <GlobeIcon /> },
};

const SocialLinks: React.FC<{
	socials: Record<string, string | undefined>;
}> = ({ socials }) => (
	<div className="flex gap-2">
		{Object.entries(socials).map(([platform, value]) => {
			const socialConfig = socialPlatforms[platform];
			if (!value || !socialConfig) return null; // Ignore unmatched or undefined social platforms

			const { icon, linkPrefix } = socialConfig;
			const href = linkPrefix ? `${linkPrefix}${value}` : value;

			return (
				<Button key={platform} variant="ghost" size="icon" asChild>
					<a href={href} target="_blank" rel="noopener noreferrer">
						{icon}
					</a>
				</Button>
			);
		})}
	</div>
);

export const Component: React.FC = () => {
	const { t } = useLocale();

	return (
		<>
			<Header>
				<Button variant="ghost" size="icon" asChild>
					<NavLink
						to="/settings"
						className="flex items-center gap-2 transition-transform hover:scale-105"
						state={{ direction: "left" }}
					>
						<ChevronLeft />
					</NavLink>
				</Button>
				<HeaderTitle>{t("about.title")}</HeaderTitle>
			</Header>
			<Container>
				<div className="flex justify-center">
					<div className="mb-4 aspect-square h-24 w-24 transform rounded-2xl bg-secondary p-2">
						<img src={logo} alt="App Logo" draggable={false} />
					</div>
				</div>
				<List.Root>
					<List.List heading={t("about.details")}>
						<SettingItem
							icon={Package}
							color="#66B2FF"
							title={t("about.version")}
							value={version}
						/>
						<SettingItem
							icon={Calendar}
							color="#F5B583"
							title={t("about.buildDate")}
							value={now.toLocaleString()}
						/>
						<SettingItem
							icon={Hash}
							color="#7A9E70"
							title={t("about.buildHash")}
							value={abbreviatedSha}
						/>
						<SettingItem
							icon={Shield}
							color="#A8AEB3"
							title={t("about.license")}
							value={license}
						/>
						{github && (
							<>
								<SettingItem
									icon={Code2Icon}
									color="#A8AEB3"
									title={t("about.repo")}
									href={github}
									chevron
								/>
								<SettingItem
									icon={Bug}
									color="#E57373"
									title={t("about.reportBug")}
									href={`${github}/issues/new?template=bug_report.md`}
									chevron
								/>
							</>
						)}
					</List.List>
					<List.List heading={t("about.contributors")}>
						{contributors.map((contributor, index) => (
							<SettingItem
								key={`${contributor.name}-${index}`}
								icon={User}
								color={getPastelColorFromHash(`${contributor.name}-${index}`)}
								title={contributor.name}
							>
								<SocialLinks
									socials={{
										email: contributor.email,
										bluesky: contributor.bluesky,
										github: contributor.github,
										website: contributor.url,
									}}
								/>
							</SettingItem>
						))}
					</List.List>
				</List.Root>
			</Container>
		</>
	);
};

Component.displayName = "Settings.About";
