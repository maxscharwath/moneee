import { Container } from '@/components/container'
import { Header, HeaderTitle } from '@/components/header'
import { Spacing } from '@/components/spacing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as List from '@/components/ui/list'
import { Select, SelectContent, SelectItem } from '@/components/ui/select'
import { useAsync } from '@/hooks/useAsync'
import { useLocale } from '@/i18n'
import { base58, derivePrivateKey, generatePrivateKey, getPublicKey, } from '@moneee/crypto'
import * as SelectPrimitive from '@radix-ui/react-select'
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser'
import { ChevronLeft, HashIcon, QrCodeIcon, VideoOffIcon, XIcon, } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

export function Component () {
  const { t } = useLocale()
  const masterKey = useKeyPair()
  const [keys, setKeys] = useState<
    { privateKey: string; publicKey: string; uuid: string }[]
  >([])

  const addKey = () => {
    setKeys((prevState) => {
      const uuid = crypto.randomUUID()
      const privateKey = derivePrivateKey(masterKey.privateKey, uuid)
      const publicKey = getPublicKey(privateKey)
      return [
        ...prevState,
        {
          uuid,
          privateKey: base58.encode(privateKey),
          publicKey: base58.encode(publicKey),
        },
      ]
    })
  }

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
        <Button onClick={addKey}>
          {t('settings.synchronisation.add-key')}
        </Button>
        <List.Root>
          <List.List>
            {keys.map((key) => (
              <List.ItemButton key={key.uuid}>
                <List.ItemIcon>
                  <QrCodeIcon/>
                </List.ItemIcon>
                {key.publicKey}
                <Spacing/>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    setKeys((prevState) =>
                      prevState.filter((k) => k.uuid !== key.uuid),
                    )
                  }
                >
                  <XIcon/>
                </Button>
              </List.ItemButton>
            ))}
          </List.List>
        </List.Root>
      </Container>
    </>
  )
}

Component.displayName = 'Settings.Synchronisation'

const useKeyPair = () => {
  const [key] = useState(() => {
    const privateKey = generatePrivateKey()
    const publicKey = getPublicKey(privateKey)
    return { privateKey, publicKey }
  })
  return key
}

const EnableSyncTab = () => {
  const key = useKeyPair()

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
