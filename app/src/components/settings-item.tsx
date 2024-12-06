import { Spacing } from '@/components/spacing'
import * as Alert from '@/components/ui/alert-dialog'
import * as List from '@/components/ui/list'
import { ChevronRight } from 'lucide-react'
import { type FC, memo, type PropsWithChildren, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type AlertProps = {
	title: string;
	description: string;
	confirmText: string;
	cancelText: string;
	onConfirm: () => void | Promise<void>;
};

type SettingItemProps = {
	icon: FC;
	color: string;
	title: string;
	action?: () => void;
	href?: string;
	value?: string | ReactNode;
	chevron?: boolean;
	alert?: AlertProps;
};

const SettingContent = memo<PropsWithChildren<SettingItemProps>>(
	({ icon: IconComponent, color, title, value, chevron, children }) => (
		<>
			<List.ItemIcon style={{ backgroundColor: color }}>
				<IconComponent />
			</List.ItemIcon>
			<span className="shrink-0 truncate">{title}</span>
			<Spacing />
			{value && <span className="truncate text-muted-foreground">{value}</span>}
			{children}
			{chevron && <ChevronRight className="shrink-0" />}
		</>
	),
);

SettingContent.displayName = "SettingContent";

const AlertDialogContent: FC<{ alert: AlertProps; content: ReactNode }> = ({
	alert,
	content,
}) => (
	<Alert.AlertDialog>
		<Alert.AlertDialogTrigger asChild>
			<List.ItemButton>{content}</List.ItemButton>
		</Alert.AlertDialogTrigger>
		<Alert.AlertDialogContent>
			<Alert.AlertDialogHeader>
				<Alert.AlertDialogTitle>{alert.title}</Alert.AlertDialogTitle>
				<Alert.AlertDialogDescription>
					{alert.description}
				</Alert.AlertDialogDescription>
			</Alert.AlertDialogHeader>
			<Alert.AlertDialogFooter>
				<Alert.AlertDialogCancel>{alert.cancelText}</Alert.AlertDialogCancel>
				<Alert.AlertDialogAction onClick={alert.onConfirm}>
					{alert.confirmText}
				</Alert.AlertDialogAction>
			</Alert.AlertDialogFooter>
		</Alert.AlertDialogContent>
	</Alert.AlertDialog>
);

export const SettingItem = memo<PropsWithChildren<SettingItemProps>>(
	({ alert, href, action, ...props }) => {
		const content = <SettingContent {...props} />;

		if (alert) {
			return <AlertDialogContent alert={alert} content={content} />;
		}

		if (href) {
			return (
				<List.ItemButton asChild>
					<NavLink to={href} state={{ direction: "right" }}>
						{content}
					</NavLink>
				</List.ItemButton>
			);
		}

		if (action) {
			return <List.ItemButton onClick={action}>{content}</List.ItemButton>;
		}

		return <List.Item>{content}</List.Item>;
	},
);

SettingItem.displayName = "SettingItem";
