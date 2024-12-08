import { Header, HeaderTitle } from '@/components/header'
import { ChevronLeft, HashIcon, VideoOffIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n'
import { Container } from '@/components/container'
import { RefObject, useEffect, useRef, useState } from 'react'
import * as TabsGroup from '@/components/ui/tabs-group'
import { base58, generatePrivateKey, getPublicKey } from '@moneee/crypto'
import { QRCodeSVG } from 'qrcode.react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem } from '@/components/ui/select'
import * as SelectPrimitive from '@radix-ui/react-select'
import { useAsync } from '@/hooks/useAsync'
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser'

export function Component () {
  const { t } = useLocale()
  const [mode, setMode] = useState<'enable-sync' | 'scan-sync'>('enable-sync')

  return (
    <>
      <Header>
        <Button variant="ghost" size="icon" asChild>
          <NavLink
            to="/settings"
            className="flex items-center gap-2"
            state={{ direction: 'left' }}
          >
            <ChevronLeft/>
          </NavLink>
        </Button>
        <HeaderTitle>{t('settings.synchronisation.title')}</HeaderTitle>
      </Header>
      <Container>
        <div className="flex w-full items-center justify-center gap-4">
          <TabsGroup.Root
            value={mode}
            onValueChange={(t) => {
              setMode(t as 'enable-sync' | 'scan-sync')
            }}
          >
            <TabsGroup.Item value="enable-sync">
              {t('settings.synchronisation.enableSync')}
            </TabsGroup.Item>
            <TabsGroup.Item value="scan-sync">
              {t('settings.synchronisation.scanSync')}
            </TabsGroup.Item>
          </TabsGroup.Root>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          {mode === 'enable-sync' ? <EnableSyncTab/> : <ScanSyncTab/>}
        </div>
      </Container>
    </>
  )
}

Component.displayName = 'Settings.Synchronisation'

const EnableSyncTab = () => {
  const [key] = useState(() => {
    const privateKey = generatePrivateKey()
    const publicKey = getPublicKey(privateKey)
    return { privateKey, publicKey }
  })

  return (
    <>
      <div className="rounded-lg aspect-square w-full max-w-64 overflow-hidden border bg-background">
        <QRCodeSVG
          height="100%"
          width="100%"
          value={base58.encode(key.publicKey)}
          marginSize={2}
        />
      </div>
      <Badge className="text-xs truncate">
        <HashIcon/>
        {base58.encode(key.publicKey)}
      </Badge>
    </>
  )
}

const ScanSyncTab = () => {
  const devices = useDevices()
  const [selected, setSelected] = useState<string>()
  const [read, setRead] = useState<string | null>(null)

  return (
    <>
      {devices.length > 0 && (
        <Select onValueChange={setSelected} value={selected} defaultValue="">
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
      <QRReader onResult={setRead} deviceId={selected} key={selected}/>
      {read && (
        <Badge className="text-xs truncate">
          <HashIcon/>
          {read}
        </Badge>
      )}
    </>
  )
}

type QRReaderProps = {
  onResult: (data: string) => void;
  deviceId?: string;
};
const QRReader = ({ onResult, deviceId }: QRReaderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<Error | null>(null)
  useQrReader({
    constraints: {
      deviceId,
      facingMode: 'environment',
    },
    scanDelay: 500,
    videoRef,
    onResult,
    onError: setError,
  })

  return (
    <div
      className="aspect-square rounded-lg w-full max-w-64 bg-secondary flex items-center justify-center border relative overflow-hidden">
      {error && <VideoOffIcon className="w-1/3 h-1/3 text-destructive"/>}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
      />
    </div>
  )
}

const useDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  useAsync(async () => {
    await navigator.mediaDevices.getUserMedia({ video: true })
    const devices = await navigator.mediaDevices.enumerateDevices()
    setDevices(devices.filter((device) => device.kind === 'videoinput'))
  }, [])
  return devices
}

type UseQrReaderHookProps = {
  constraints: MediaTrackConstraints;
  onResult?: (result: string) => void;
  onError?: (error: Error) => void;
  scanDelay: number;
  videoRef: RefObject<HTMLVideoElement | null>;
};
export const useQrReader = ({
  constraints,
  onResult,
  onError,
  scanDelay,
  videoRef,
}: UseQrReaderHookProps) => {
  const controlsRef = useRef<IScannerControls>(null)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: scanDelay,
    })

    codeReader
      .decodeFromConstraints(
        { video: constraints },
        videoRef.current,
        (result, error) => {
          if (result) {
            onResult?.(result.getText())
          }
          if (error) {
            onError?.(error)
          }
        },
      )
      .then((controls: IScannerControls) => {
        controlsRef.current = controls
      })
      .catch((error: Error) => {
        onError?.(error)
      })

    return () => {
      controlsRef.current?.stop()
    }
  }, [])
}
