import { Header, HeaderTitle } from '@/components/header'
import { ChevronLeft, HashIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n'
import { Container } from '@/components/container'
import { useEffect, useState } from 'react'
import * as TabsGroup from '@/components/ui/tabs-group'
import { base58, generatePrivateKey, getPublicKey } from '@moneee/crypto'
import { QRCodeSVG } from 'qrcode.react'
import { Badge } from '@/components/ui/badge'
import { useQrReader } from 'react-qr-reader'
import { Select, SelectContent, SelectItem } from '@/components/ui/select'
import * as SelectPrimitive from '@radix-ui/react-select'

export function Component() {
	const { t } = useLocale();
	const [mode, setMode] = useState<"register" | "login">("register");
	const [key] = useState(() => {
		const privateKey = generatePrivateKey();
		const publicKey = getPublicKey(privateKey);
		return { privateKey, publicKey };
	});
	const [readed, setReaded] = useState<string | null>(null);
	const devices = useDevices();
	const [selected, setSelected] = useState<string>();

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
				<HeaderTitle>{t("settings.synchronisation.title")}</HeaderTitle>
			</Header>
			<Container>
				<div className="flex w-full items-center justify-center gap-4">
					<TabsGroup.Root
						value={mode}
						onValueChange={(t) => {
							setMode(t as "register" | "login");
						}}
					>
						<TabsGroup.Item value="register">
							{t("settings.synchronisation.register")}
						</TabsGroup.Item>
						<TabsGroup.Item value="login">
							{t("settings.synchronisation.login")}
						</TabsGroup.Item>
					</TabsGroup.Root>
				</div>
				<div className="flex flex-col items-center justify-center gap-4">
					{mode === "register" ? (
						<>
							<div className="rounded-lg aspect-square w-full max-w-52 overflow-hidden">
								<QRCodeSVG
									height="100%"
									width="100%"
									value={base58.encode(key.publicKey)}
									marginSize={2}
								/>
							</div>
							<Badge className="text-xs truncate">
								<HashIcon />
								{base58.encode(key.publicKey)}
							</Badge>
						</>
					) : (
						<>
							{devices.length > 0 && (
								<Select
									onValueChange={setSelected}
									value={selected}
									defaultValue=""
								>
									<SelectPrimitive.Trigger>
										<Button variant="ghost">Switch Camera</Button>
									</SelectPrimitive.Trigger>
									<SelectContent>
										{devices.map((device) => (
											<SelectItem key={device.deviceId} value={device.deviceId}>
												{device.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<QRReader
								onResult={setReaded}
								deviceId={selected}
								key={selected}
							/>
							{readed && (
								<Badge className="text-xs truncate">
									<HashIcon />
									{readed}
								</Badge>
							)}
						</>
					)}
				</div>
			</Container>
		</>
	);
}

Component.displayName = "Settings.Synchronisation";

type QRReaderProps = {
	onResult: (data: string) => void;
	deviceId?: string;
};
const QRReader = ({ onResult, deviceId }: QRReaderProps) => {
	useQrReader({
		constraints: {
			deviceId,
		},
		scanDelay: 500,
		videoId: "qr-reader",
		onResult: (data) => {
			if (data) {
				onResult(data.getText());
			}
		},
	});
	return (
		<video
			id="qr-reader"
			className="aspect-square object-cover rounded-lg w-full max-w-52 h-auto"
			muted
		/>
	);
};

const useDevices = () => {
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true }).then(async () => {
			const devices = await navigator.mediaDevices.enumerateDevices();
			setDevices(devices.filter((device) => device.kind === "videoinput"));
		});
	}, []);

	return devices;
};
